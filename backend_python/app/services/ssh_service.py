"""
File: services/ssh_service.py

Service untuk komunikasi SSH dengan perangkat ZTE OLT
Menangani eksekusi perintah CLI melalui SSH untuk provisioning dan management

Fungsi utama:
- Provision ONU melalui SSH CLI
- Delete ONU dari OLT
- Update serial number ONU
- Reboot dan reset ONU
- Membuat akun PPPoE melalui CLI

Alur kerja:
1. Membuat koneksi SSH ke OLT menggunakan Paramiko
2. Mendekripsi password SSH dari database
3. Mengeksekusi perintah CLI sesuai kebutuhan
4. Mengembalikan hasil eksekusi atau error

Perintah CLI yang digunakan:
- configure terminal: Masuk ke mode konfigurasi
- interface gpon-olt_{port}: Masuk ke interface PON
- onu {id} type ZTE-F601 sn {serial}: Provision ONU
- no onu {id}: Delete ONU
- reboot: Reboot ONU
- reset factory-default: Reset ONU

Catatan:
- Perintah CLI perlu disesuaikan dengan versi firmware ZTE yang digunakan
- Timeout default 30 detik untuk menghindari hanging
- Password SSH disimpan terenkripsi di database
"""

import paramiko
from app.models import Olt
from typing import Optional, List, Dict
import time
from cryptography.fernet import Fernet
import os

class SshService:
    """
    Service untuk komunikasi SSH dengan perangkat ZTE OLT
    
    Service ini menangani semua operasi yang dilakukan melalui SSH CLI,
    termasuk provisioning, management, dan konfigurasi ONU.
    Kredensial SSH disimpan terenkripsi di database dan didekripsi saat digunakan.
    """
    
    def _decrypt_password(self, encrypted_password: str) -> str:
        """
        Mendekripsi password yang tersimpan terenkripsi di database
        
        Args:
            encrypted_password: Password terenkripsi dari database
            
        Returns:
            Password dalam bentuk plain text
        """
        try:
            key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
            if isinstance(key, str):
                key = key.encode()
            f = Fernet(key)
            return f.decrypt(encrypted_password.encode()).decode()
        except:
            # Jika dekripsi gagal, asumsikan password masih plain text (untuk development)
            return encrypted_password
    
    def _get_connection(self, olt: Olt) -> Optional[paramiko.SSHClient]:
        """
        Membuat koneksi SSH ke OLT
        
        Args:
            olt: Object OLT dari database
            
        Returns:
            SSHClient object atau None jika koneksi gagal
        """
        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            
            password = self._decrypt_password(olt.ssh_password) if olt.ssh_password else None
            
            ssh.connect(
                hostname=olt.ip_address,
                port=olt.ssh_port or 22,
                username=olt.ssh_username or 'admin',
                password=password,
                timeout=10,
                look_for_keys=False,
                allow_agent=False
            )
            return ssh
        except Exception as e:
            print(f"SSH connection error: {e}")
            return None
    
    def execute_command(self, olt: Olt, command: str, timeout: int = 30) -> Optional[str]:
        """
        Mengeksekusi perintah CLI pada OLT melalui SSH
        
        Args:
            olt: Object OLT dari database
            command: Perintah CLI yang akan dieksekusi
            timeout: Timeout dalam detik
            
        Returns:
            Output dari perintah atau None jika error
        """
        ssh = self._get_connection(olt)
        if not ssh:
            return None
        
        try:
            stdin, stdout, stderr = ssh.exec_command(command, timeout=timeout)
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            
            if error:
                print(f"SSH command error: {error}")
            
            return output if output else None
        except Exception as e:
            print(f"SSH command execution error: {e}")
            return None
        finally:
            ssh.close()
    
    def provision_onu(self, olt: Olt, pon_port: int, onu_id: int, serial_number: str) -> bool:
        """
        Provision ONU baru pada OLT melalui SSH CLI
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            serial_number: Serial number ONU
            
        Returns:
            True jika berhasil, False jika gagal
        """
        # Format perintah CLI ZTE OLT (sesuaikan dengan firmware yang digunakan)
        command = f"""configure terminal
interface gpon-olt_{pon_port}
onu {onu_id} type ZTE-F601 sn {serial_number}
end
"""
        result = self.execute_command(olt, command)
        return result is not None and "success" in result.lower()
    
    def delete_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """
        Hapus ONU dari OLT melalui SSH CLI
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            True jika berhasil, False jika gagal
        """
        command = f"""configure terminal
interface gpon-olt_{pon_port}
no onu {onu_id}
end
"""
        result = self.execute_command(olt, command)
        return result is not None
    
    def update_onu_serial(self, olt: Olt, pon_port: int, onu_id: int, new_serial: str) -> bool:
        """
        Update serial number ONU melalui SSH CLI
        Dilakukan dengan delete lalu re-provision
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            new_serial: Serial number baru
            
        Returns:
            True jika berhasil, False jika gagal
        """
        # Delete dan re-provision
        if self.delete_onu(olt, pon_port, onu_id):
            time.sleep(2)
            return self.provision_onu(olt, pon_port, onu_id, new_serial)
        return False
    
    def reboot_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """
        Reboot ONU melalui SSH CLI
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            True jika berhasil, False jika gagal
        """
        command = f"""configure terminal
interface gpon-olt_{pon_port}
onu {onu_id}
reboot
end
"""
        result = self.execute_command(olt, command)
        return result is not None
    
    def reset_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """
        Reset ONU ke factory default melalui SSH CLI
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            True jika berhasil, False jika gagal
        """
        command = f"""configure terminal
interface gpon-olt_{pon_port}
onu {onu_id}
reset factory-default
end
"""
        result = self.execute_command(olt, command)
        return result is not None
    
    def create_pppoe_account(self, olt: Olt, pon_port: int, onu_id: int, pppoe_data: Dict) -> bool:
        """
        Membuat akun PPPoE pada ONU melalui SSH CLI
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            pppoe_data: Data akun PPPoE (username, password, vlan_id, dll)
            
        Returns:
            True jika berhasil, False jika gagal
        """
        username = pppoe_data.get('username', '')
        password = pppoe_data.get('password', '')
        vlan_id = pppoe_data.get('vlan_id', '')
        
        # Format perintah CLI ZTE OLT untuk PPPoE (sesuaikan dengan firmware)
        command = f"""configure terminal
interface gpon-olt_{pon_port}
onu {onu_id}
interface eth_1/1
service-port vlan {vlan_id} pppoe user {username} password {password}
end
"""
        result = self.execute_command(olt, command)
        return result is not None
    
    def get_onu_status(self, olt: Olt, pon_port: int, onu_id: int) -> Optional[Dict]:
        """
        Mendapatkan status ONU melalui SSH CLI
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            Dictionary berisi status ONU atau None jika error
        """
        command = f"show onu status gpon-olt_{pon_port} {onu_id}\n"
        result = self.execute_command(olt, command)
        if result:
            # Parse output (sesuaikan dengan format output CLI)
            return {"status": "online" if "up" in result.lower() else "offline"}
        return None
