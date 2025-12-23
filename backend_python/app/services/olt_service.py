"""
File: services/olt_service.py

Unified OLT Service yang menggabungkan SNMP, SSH, dan REST API
Service utama untuk semua operasi OLT dan ONU

Fungsi utama:
- Poll OLT untuk mendapatkan status dan performa
- Sync ONU dari OLT ke database
- Provision ONU menggunakan metode yang dipilih (SNMP/SSH/REST API)
- Management ONU (delete, reboot, reset)

Alur kerja:
1. Service ini mengkoordinasikan antara SNMP, SSH, dan REST API service
2. User dapat memilih metode yang digunakan untuk operasi tertentu
3. Service melakukan polling berkala untuk update status
4. Service melakukan sync ONU untuk sinkronisasi data

Metode yang didukung:
- snmp: Menggunakan SNMP service (default untuk monitoring)
- ssh: Menggunakan SSH service (untuk provisioning dan management)
- rest_api: Menggunakan ZTE REST API service (untuk operasi via API)

Catatan:
- Polling OLT dilakukan secara berkala untuk update status real-time
- Sync ONU dilakukan untuk sinkronisasi data dari OLT ke database
- Setiap operasi dicatat dalam activity log untuk audit
"""

from app.models import Olt
from app.services.snmp_service import SnmpService
from app.services.ssh_service import SshService
from app.services.zte_api_service import ZteApiService
from typing import Optional, Dict, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import OltStatus, OnuStatus, Onu, Alarm, AlarmSeverity, AlarmStatus

class OltService:
    """
    Unified service untuk operasi OLT
    
    Service ini menggabungkan SNMP, SSH, dan REST API service
    untuk menyediakan interface yang konsisten untuk semua operasi OLT.
    """
    
    def __init__(self):
        self.snmp = SnmpService()
        self.ssh = SshService()
        self.zte_api = ZteApiService()
    
    def check_olt_status(self, olt: Olt) -> bool:
        """
        Memeriksa apakah OLT online
        
        Args:
            olt: Object OLT dari database
            
        Returns:
            True jika OLT online, False jika offline
        """
        try:
            # Coba SNMP terlebih dahulu
            sys_info = self.snmp.get_system_info(olt)
            if sys_info.get('sysName'):
                return True
            
            # Coba REST API
            status = self.zte_api.get_olt_status(olt)
            if status:
                return True
            
            return False
        except:
            return False
    
    def poll_olt(self, olt: Olt, db: Session) -> Dict:
        """
        Poll OLT untuk mendapatkan status dan performa terbaru
        
        Args:
            olt: Object OLT dari database
            db: Database session
            
        Returns:
            Dictionary berisi status dan performa OLT
        """
        try:
            # Cek status
            is_online = self.check_olt_status(olt)
            olt.status = OltStatus.ONLINE if is_online else OltStatus.OFFLINE
            olt.last_polled_at = datetime.utcnow()
            
            if is_online:
                # Ambil data performa
                performance = self.snmp.get_olt_performance(olt)
                olt.cpu_usage = performance.get('cpu_usage')
                olt.memory_usage = performance.get('memory_usage')
                olt.uptime = performance.get('uptime')
                olt.temperature = performance.get('temperature')
                
                # Ambil system info
                sys_info = self.snmp.get_system_info(olt)
                if sys_info.get('sysName') and not olt.hostname:
                    olt.hostname = sys_info.get('sysName')
                if sys_info.get('sysDescr') and not olt.firmware_version:
                    # Coba extract firmware version dari description
                    descr = sys_info.get('sysDescr', '')
                    if 'version' in descr.lower():
                        olt.firmware_version = descr
                
                db.commit()
                
                return {
                    "status": "online",
                    "performance": performance,
                    "system_info": sys_info
                }
            else:
                db.commit()
                return {"status": "offline"}
        except Exception as e:
            print(f"Error polling OLT {olt.id}: {e}")
            olt.status = OltStatus.OFFLINE
            db.commit()
            return {"status": "error", "error": str(e)}
    
    def sync_onus(self, olt: Olt, db: Session) -> Dict:
        """
        Sync ONU dari OLT ke database
        
        Args:
            olt: Object OLT dari database
            db: Database session
            
        Returns:
            Dictionary berisi hasil sync (synced, created, updated)
        """
        try:
            # Ambil daftar ONU dari OLT
            onu_list = self.snmp.get_onu_list(olt)
            
            synced_count = 0
            updated_count = 0
            created_count = 0
            
            for onu_data in onu_list:
                serial_number = onu_data.get('serial_number')
                if not serial_number:
                    continue
                
                # Cek apakah ONU sudah ada
                existing_onu = db.query(Onu).filter(
                    Onu.serial_number == serial_number,
                    Onu.olt_id == olt.id
                ).first()
                
                pon_port = onu_data.get('pon_port')
                onu_id = onu_data.get('onu_id')
                status = OnuStatus.ONLINE if onu_data.get('status') == 'online' else OnuStatus.OFFLINE
                rx_power = onu_data.get('rx_power')
                tx_power = onu_data.get('tx_power')
                
                if existing_onu:
                    # Update ONU yang sudah ada
                    old_status = existing_onu.status
                    existing_onu.status = status
                    existing_onu.rx_power = rx_power
                    existing_onu.tx_power = tx_power
                    existing_onu.last_seen_at = datetime.utcnow()
                    
                    # Track perubahan status
                    if old_status != status:
                        existing_onu.last_status_change = datetime.utcnow()
                        # Buat alarm jika ONU offline
                        if status == OnuStatus.OFFLINE:
                            alarm = Alarm(
                                olt_id=olt.id,
                                onu_id=existing_onu.id,
                                severity=AlarmSeverity.MAJOR,
                                type="onu_down",
                                message=f"ONU {serial_number} is offline",
                                status=AlarmStatus.ACTIVE,
                                occurred_at=datetime.utcnow()
                            )
                            db.add(alarm)
                    
                    updated_count += 1
                else:
                    # Buat ONU baru
                    new_onu = Onu(
                        olt_id=olt.id,
                        serial_number=serial_number,
                        pon_port=pon_port,
                        onu_id=onu_id,
                        status=status,
                        rx_power=rx_power,
                        tx_power=tx_power,
                        last_seen_at=datetime.utcnow(),
                        provisioned_at=datetime.utcnow()
                    )
                    db.add(new_onu)
                    created_count += 1
                
                synced_count += 1
            
            db.commit()
            
            return {
                "synced": synced_count,
                "created": created_count,
                "updated": updated_count
            }
        except Exception as e:
            print(f"Error syncing ONUs for OLT {olt.id}: {e}")
            db.rollback()
            return {"error": str(e)}
    
    def provision_onu(
        self,
        olt: Olt,
        pon_port: int,
        onu_id: int,
        serial_number: str,
        method: str = "snmp"
    ) -> bool:
        """
        Provision ONU menggunakan metode yang dipilih
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            serial_number: Serial number ONU
            method: Metode yang digunakan ('snmp', 'ssh', atau 'rest_api')
            
        Returns:
            True jika berhasil, False jika gagal
        """
        if method == "ssh":
            return self.ssh.provision_onu(olt, pon_port, onu_id, serial_number)
        elif method == "rest_api":
            return self.zte_api.provision_onu(olt, pon_port, onu_id, serial_number)
        else:  # default to SNMP
            return self.snmp.provision_onu(olt, pon_port, onu_id, serial_number)
    
    def delete_onu(
        self,
        olt: Olt,
        pon_port: int,
        onu_id: int,
        method: str = "snmp"
    ) -> bool:
        """
        Hapus ONU menggunakan metode yang dipilih
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            method: Metode yang digunakan ('snmp', 'ssh', atau 'rest_api')
            
        Returns:
            True jika berhasil, False jika gagal
        """
        if method == "ssh":
            return self.ssh.delete_onu(olt, pon_port, onu_id)
        elif method == "rest_api":
            return self.zte_api.delete_onu(olt, pon_port, onu_id)
        else:  # default to SNMP
            return self.snmp.delete_onu(olt, pon_port, onu_id)
    
    def reboot_onu(
        self,
        olt: Olt,
        pon_port: int,
        onu_id: int,
        method: str = "snmp"
    ) -> bool:
        """
        Reboot ONU menggunakan metode yang dipilih
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            method: Metode yang digunakan ('snmp', 'ssh', atau 'rest_api')
            
        Returns:
            True jika berhasil, False jika gagal
        """
        if method == "ssh":
            return self.ssh.reboot_onu(olt, pon_port, onu_id)
        elif method == "rest_api":
            return self.zte_api.reboot_onu(olt, pon_port, onu_id)
        else:  # default to SNMP
            return self.snmp.reboot_onu(olt, pon_port, onu_id)
    
    def reset_onu(
        self,
        olt: Olt,
        pon_port: int,
        onu_id: int,
        method: str = "snmp"
    ) -> bool:
        """
        Reset ONU ke factory default menggunakan metode yang dipilih
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            method: Metode yang digunakan ('snmp', 'ssh', atau 'rest_api')
            
        Returns:
            True jika berhasil, False jika gagal
        """
        if method == "ssh":
            return self.ssh.reset_onu(olt, pon_port, onu_id)
        elif method == "rest_api":
            return self.zte_api.reset_onu(olt, pon_port, onu_id)
        else:  # default to SNMP
            return self.snmp.reset_onu(olt, pon_port, onu_id)
