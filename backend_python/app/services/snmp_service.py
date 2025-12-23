"""
File: services/snmp_service.py

Service untuk komunikasi SNMP dengan perangkat ZTE OLT
Mendukung SNMP v2c dan v3 untuk monitoring dan pengambilan data

Fungsi utama:
- Monitoring status OLT dan ONU melalui SNMP
- Pengambilan data performa OLT (CPU, memory, temperature, uptime)
- Pengambilan data ONU (status, RX/TX power, serial number)
- Provisioning dan management ONU melalui SNMP SET
- Support untuk SNMP v2c (community string) dan v3 (username/password)

Alur kerja:
1. Membuat koneksi SNMP ke OLT berdasarkan IP dan port
2. Menggunakan community string (v2c) atau username/password (v3)
3. Melakukan SNMP GET untuk membaca data
4. Melakukan SNMP WALK untuk membaca multiple OID
5. Melakukan SNMP SET untuk menulis konfigurasi

OID yang digunakan:
- Standard SNMP OID untuk system info (sysDescr, sysUpTime, dll)
- ZTE specific OID untuk PON, ONU, dan performa
- OID perlu disesuaikan dengan MIB perangkat ZTE C300/C320 yang sebenarnya

Catatan:
- OID di file ini adalah contoh, perlu disesuaikan dengan dokumentasi MIB ZTE
- Password SNMP v3 disimpan terenkripsi di database
- Timeout default 5-10 detik untuk menghindari blocking
"""
from pysnmp.hlapi import *
from pysnmp import hlapi
from app.models import Olt
from typing import Optional, Dict, List
import time
from cryptography.fernet import Fernet
import os
import base64

class SnmpService:
    """SNMP Service for ZTE OLT communication"""
    
    # ZTE OLT OIDs - adjust based on your ZTE model (C300/C320)
    ZTE_OID_BASE = '1.3.6.1.4.1.3902'
    
    # System OIDs (standard SNMP)
    SYS_DESCR = '1.3.6.1.2.1.1.1.0'
    SYS_UPTIME = '1.3.6.1.2.1.1.3.0'
    SYS_NAME = '1.3.6.1.2.1.1.5.0'
    SYS_LOCATION = '1.3.6.1.2.1.1.6.0'
    
    # ZTE specific OIDs (examples - adjust based on actual ZTE MIB)
    ZTE_PON_PORT = f'{ZTE_OID_BASE}.1015.1.1.1.1.1'
    ZTE_ONU_LIST = f'{ZTE_OID_BASE}.1015.1.1.1.1.2'
    ZTE_ONU_SERIAL = f'{ZTE_OID_BASE}.1015.1.1.1.1.3'
    ZTE_ONU_STATUS = f'{ZTE_OID_BASE}.1015.1.1.1.1.4'
    ZTE_ONU_RX_POWER = f'{ZTE_OID_BASE}.1015.1.1.1.1.5'
    ZTE_ONU_TX_POWER = f'{ZTE_OID_BASE}.1015.1.1.1.1.6'
    
    # Performance OIDs (examples - adjust based on actual ZTE MIB)
    ZTE_CPU_USAGE = f'{ZTE_OID_BASE}.1010.1.1.1.1.1'  # CPU usage percentage
    ZTE_MEMORY_USAGE = f'{ZTE_OID_BASE}.1010.1.1.1.1.2'  # Memory usage percentage
    ZTE_TEMPERATURE = f'{ZTE_OID_BASE}.1010.1.1.1.1.3'  # Temperature in Celsius
    
    def _get_auth_data(self, olt: Olt):
        """Get SNMP authentication data based on version"""
        if olt.snmp_version == 3:
            # SNMP v3
            if olt.snmp_username and olt.snmp_password:
                # Decrypt password if encrypted
                password = self._decrypt_password(olt.snmp_password)
                return UsmUserData(
                    olt.snmp_username,
                    authKey=password,
                    privKey=password,
                    authProtocol=usmHMACSHAAuthProtocol,
                    privProtocol=usmAesCfb128Protocol
                )
            else:
                # Default v3 credentials
                return UsmUserData('admin', 'admin', 'admin')
        else:
            # SNMP v2c
            return CommunityData(olt.snmp_community or 'public')
    
    def _decrypt_password(self, encrypted_password: str) -> str:
        """Decrypt password (simple implementation - use proper key management in production)"""
        try:
            # In production, use proper key management
            key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
            if isinstance(key, str):
                key = key.encode()
            f = Fernet(key)
            return f.decrypt(encrypted_password.encode()).decode()
        except:
            # If decryption fails, assume it's plain text (for development)
            return encrypted_password
    
    def get(self, olt: Olt, oid: str, timeout: int = 5) -> Optional[str]:
        """Get single SNMP value"""
        try:
            auth_data = self._get_auth_data(olt)
            
            for (errorIndication, errorStatus, errorIndex, varBinds) in getCmd(
                SnmpEngine(),
                auth_data,
                UdpTransportTarget((olt.ip_address, olt.snmp_port), timeout=timeout, retries=3),
                ContextData(),
                ObjectType(ObjectIdentity(oid)),
                lexicographicMode=False
            ):
                if errorIndication:
                    print(f"SNMP error indication: {errorIndication}")
                    return None
                if errorStatus:
                    print(f"SNMP error status: {errorStatus.prettyPrint()}")
                    return None
                
                for oid, val in varBinds:
                    return str(val)
            
            return None
        except Exception as e:
            print(f"SNMP GET error: {e}")
            return None
    
    def set(self, olt: Olt, oid: str, value_type: str, value, timeout: int = 5) -> bool:
        """Set SNMP value"""
        try:
            auth_data = self._get_auth_data(olt)
            
            # Map value types to SNMP types
            if value_type == 'i':
                obj_type = Integer(value)
            elif value_type == 's':
                obj_type = OctetString(value)
            else:
                obj_type = OctetString(str(value))
            
            for (errorIndication, errorStatus, errorIndex, varBinds) in setCmd(
                SnmpEngine(),
                auth_data,
                UdpTransportTarget((olt.ip_address, olt.snmp_port), timeout=timeout, retries=3),
                ContextData(),
                ObjectType(ObjectIdentity(oid), obj_type),
                lexicographicMode=False
            ):
                if errorIndication:
                    print(f"SNMP SET error indication: {errorIndication}")
                    return False
                if errorStatus:
                    print(f"SNMP SET error status: {errorStatus.prettyPrint()}")
                    return False
                
                return True
            
            return False
        except Exception as e:
            print(f"SNMP SET error: {e}")
            return False
    
    def walk(self, olt: Olt, oid: str, timeout: int = 10) -> Dict[str, str]:
        """Walk SNMP OID tree"""
        result = {}
        try:
            auth_data = self._get_auth_data(olt)
            
            for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
                SnmpEngine(),
                auth_data,
                UdpTransportTarget((olt.ip_address, olt.snmp_port), timeout=timeout, retries=3),
                ContextData(),
                ObjectType(ObjectIdentity(oid)),
                lexicographicMode=False,
                maxRows=1000  # Limit rows to prevent timeout
            ):
                if errorIndication:
                    break
                if errorStatus:
                    break
                
                oid_str = str(varBinds[0][0])
                val_str = str(varBinds[0][1])
                result[oid_str] = val_str
            
            return result
        except Exception as e:
            print(f"SNMP WALK error: {e}")
            return {}
    
    def get_system_info(self, olt: Olt) -> Dict[str, Optional[str]]:
        """Get OLT system information"""
        return {
            'sysDescr': self.get(olt, self.SYS_DESCR),
            'sysUpTime': self.get(olt, self.SYS_UPTIME),
            'sysName': self.get(olt, self.SYS_NAME),
            'sysLocation': self.get(olt, self.SYS_LOCATION),
        }
    
    def get_olt_performance(self, olt: Olt) -> Dict[str, Optional[float]]:
        """Get OLT performance metrics (CPU, memory, temperature, uptime)"""
        uptime_str = self.get(olt, self.SYS_UPTIME)
        uptime = None
        if uptime_str:
            try:
                # Uptime is in hundredths of seconds
                uptime = int(uptime_str) // 100
            except:
                pass
        
        cpu_str = self.get(olt, self.ZTE_CPU_USAGE)
        cpu_usage = None
        if cpu_str:
            try:
                cpu_usage = float(cpu_str)
            except:
                pass
        
        memory_str = self.get(olt, self.ZTE_MEMORY_USAGE)
        memory_usage = None
        if memory_str:
            try:
                memory_usage = float(memory_str)
            except:
                pass
        
        temp_str = self.get(olt, self.ZTE_TEMPERATURE)
        temperature = None
        if temp_str:
            try:
                temperature = float(temp_str)
            except:
                pass
        
        return {
            'cpu_usage': cpu_usage,
            'memory_usage': memory_usage,
            'uptime': uptime,
            'temperature': temperature
        }
    
    def get_onu_list(self, olt: Olt) -> List[Dict]:
        """Get ONU list from OLT"""
        onus = []
        try:
            # Walk through PON ports
            pon_ports = self.walk(olt, self.ZTE_PON_PORT)
            
            for port_oid, port_index in pon_ports.items():
                try:
                    port_num = int(port_index)
                    onu_list_oid = f"{self.ZTE_ONU_LIST}.{port_num}"
                    onu_list = self.walk(olt, onu_list_oid)
                    
                    for onu_oid, onu_id in onu_list.items():
                        try:
                            onu_id_num = int(onu_id)
                            serial_oid = f"{self.ZTE_ONU_SERIAL}.{port_num}.{onu_id_num}"
                            status_oid = f"{self.ZTE_ONU_STATUS}.{port_num}.{onu_id_num}"
                            rx_power_oid = f"{self.ZTE_ONU_RX_POWER}.{port_num}.{onu_id_num}"
                            tx_power_oid = f"{self.ZTE_ONU_TX_POWER}.{port_num}.{onu_id_num}"
                            
                            serial = self.get(olt, serial_oid)
                            status_val = self.get(olt, status_oid)
                            rx_power = self.get(olt, rx_power_oid)
                            tx_power = self.get(olt, tx_power_oid)
                            
                            if serial:
                                status = 'online' if str(status_val) in ['1', 'online', 'up'] else 'offline'
                                
                                # Convert power values (usually in 0.01 dBm units)
                                rx_power_dbm = None
                                if rx_power:
                                    try:
                                        rx_power_dbm = float(rx_power) / 100.0
                                    except:
                                        pass
                                
                                tx_power_dbm = None
                                if tx_power:
                                    try:
                                        tx_power_dbm = float(tx_power) / 100.0
                                    except:
                                        pass
                                
                                onus.append({
                                    'pon_port': port_num,
                                    'onu_id': onu_id_num,
                                    'serial_number': str(serial).strip(),
                                    'status': status,
                                    'rx_power': rx_power_dbm,
                                    'tx_power': tx_power_dbm,
                                })
                        except Exception as e:
                            print(f"Error processing ONU {onu_id}: {e}")
                            continue
                except Exception as e:
                    print(f"Error processing PON port {port_index}: {e}")
                    continue
            
            return onus
        except Exception as e:
            print(f"Error getting ONU list: {e}")
            return []
    
    def provision_onu(self, olt: Olt, pon_port: int, onu_id: int, serial_number: str) -> bool:
        """Provision ONU on OLT via SNMP"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.7.{pon_port}.{onu_id}"
        return self.set(olt, oid, 's', serial_number)
    
    def delete_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """Delete ONU from OLT via SNMP"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.8.{pon_port}.{onu_id}"
        return self.set(olt, oid, 'i', 1)
    
    def update_onu_serial(self, olt: Olt, pon_port: int, onu_id: int, new_serial: str) -> bool:
        """Update ONU serial number"""
        if self.delete_onu(olt, pon_port, onu_id):
            time.sleep(1)
            return self.provision_onu(olt, pon_port, onu_id, new_serial)
        return False
    
    def reboot_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """Reboot ONU via SNMP"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.9.{pon_port}.{onu_id}"
        return self.set(olt, oid, 'i', 1)
    
    def reset_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """Reset ONU to factory defaults via SNMP"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.10.{pon_port}.{onu_id}"
        return self.set(olt, oid, 'i', 1)
    
    def create_pppoe_account(self, olt: Olt, pon_port: int, onu_id: int, pppoe_data: Dict) -> bool:
        """Create PPPoE account on ONU via SNMP"""
        username_oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.11.{pon_port}.{onu_id}"
        password_oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.12.{pon_port}.{onu_id}"
        vlan_oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.13.{pon_port}.{onu_id}"
        
        success = True
        success &= self.set(olt, username_oid, 's', pppoe_data.get('username', ''))
        success &= self.set(olt, password_oid, 's', pppoe_data.get('password', ''))
        
        if 'vlan_id' in pppoe_data:
            success &= self.set(olt, vlan_oid, 'i', int(pppoe_data['vlan_id']))
        
        return success
