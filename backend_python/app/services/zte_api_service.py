"""
File: services/zte_api_service.py

Service untuk komunikasi dengan REST API perangkat ZTE OLT
Menangani semua request HTTP ke endpoint API perangkat ZTE (165.99.239.14:1661)

Fungsi utama:
- Provision ONU melalui REST API
- Delete ONU dari OLT
- Update serial number ONU
- Reboot dan reset ONU
- Membuat akun PPPoE
- Mendapatkan daftar ONU dan status

Alur kerja:
1. Mendapatkan kredensial API dari database (terenkripsi)
2. Mendekripsi password menggunakan Fernet
3. Membuat HTTP request dengan Basic Auth
4. Mengirim request ke endpoint API perangkat ZTE
5. Mengembalikan response atau error

Endpoint default: http://<OLT_IP>:1661
Endpoint dapat dikustomisasi per OLT melalui field api_endpoint di database
"""

import requests
from app.models import Olt
from typing import Optional, Dict, List
import json
from cryptography.fernet import Fernet
import os
from requests.auth import HTTPBasicAuth

class ZteApiService:
    """
    Service untuk komunikasi REST API dengan perangkat ZTE OLT
    
    Service ini menangani semua operasi yang dilakukan melalui REST API
    perangkat ZTE, termasuk provisioning, management, dan monitoring ONU.
    Kredensial API disimpan terenkripsi di database dan didekripsi saat digunakan.
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
    
    def _get_auth(self, olt: Olt) -> Optional[HTTPBasicAuth]:
        """
        Membuat object HTTPBasicAuth untuk autentikasi API
        
        Args:
            olt: Object OLT dari database
            
        Returns:
            HTTPBasicAuth object atau None jika tidak ada kredensial
        """
        if olt.api_username and olt.api_password:
            password = self._decrypt_password(olt.api_password)
            return HTTPBasicAuth(olt.api_username, password)
        return None
    
    def _get_base_url(self, olt: Olt) -> str:
        """
        Mendapatkan base URL untuk REST API
        
        Args:
            olt: Object OLT dari database
            
        Returns:
            Base URL untuk API endpoint (default: http://<IP>:1661)
        """
        if olt.api_endpoint:
            return olt.api_endpoint.rstrip('/')
        # Default endpoint sesuai dokumentasi: 165.99.239.14:1661
        return f"http://{olt.ip_address}:1661"
    
    def _make_request(self, olt: Olt, method: str, endpoint: str, data: Optional[Dict] = None) -> Optional[Dict]:
        """
        Membuat HTTP request ke REST API perangkat ZTE
        
        Args:
            olt: Object OLT dari database
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: Endpoint API (contoh: /api/onu/provision)
            data: Data untuk request body (untuk POST/PUT)
            
        Returns:
            Response JSON dari API atau None jika error
        """
        try:
            url = f"{self._get_base_url(olt)}{endpoint}"
            auth = self._get_auth(olt)
            headers = {"Content-Type": "application/json"}
            
            if method.upper() == "GET":
                response = requests.get(url, auth=auth, headers=headers, timeout=10)
            elif method.upper() == "POST":
                response = requests.post(url, auth=auth, headers=headers, json=data, timeout=10)
            elif method.upper() == "PUT":
                response = requests.put(url, auth=auth, headers=headers, json=data, timeout=10)
            elif method.upper() == "DELETE":
                response = requests.delete(url, auth=auth, headers=headers, timeout=10)
            else:
                return None
            
            if response.status_code in [200, 201]:
                return response.json()
            else:
                print(f"REST API error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"REST API request error: {e}")
            return None
    
    def provision_onu(self, olt: Olt, pon_port: int, onu_id: int, serial_number: str, **kwargs) -> bool:
        """
        Provision ONU baru pada OLT melalui REST API
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            serial_number: Serial number ONU
            **kwargs: Parameter tambahan untuk provisioning
            
        Returns:
            True jika berhasil, False jika gagal
        """
        data = {
            "pon_port": pon_port,
            "onu_id": onu_id,
            "serial_number": serial_number,
            **kwargs
        }
        result = self._make_request(olt, "POST", "/api/onu/provision", data)
        return result is not None and result.get("success", False)
    
    def delete_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """
        Hapus ONU dari OLT melalui REST API
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            True jika berhasil, False jika gagal
        """
        data = {
            "pon_port": pon_port,
            "onu_id": onu_id
        }
        result = self._make_request(olt, "DELETE", "/api/onu/delete", data)
        return result is not None and result.get("success", False)
    
    def update_onu_serial(self, olt: Olt, pon_port: int, onu_id: int, new_serial: str) -> bool:
        """
        Update serial number ONU melalui REST API
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            new_serial: Serial number baru
            
        Returns:
            True jika berhasil, False jika gagal
        """
        data = {
            "pon_port": pon_port,
            "onu_id": onu_id,
            "serial_number": new_serial
        }
        result = self._make_request(olt, "PUT", "/api/onu/update-serial", data)
        return result is not None and result.get("success", False)
    
    def reboot_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """
        Reboot ONU melalui REST API
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            True jika berhasil, False jika gagal
        """
        data = {
            "pon_port": pon_port,
            "onu_id": onu_id
        }
        result = self._make_request(olt, "POST", "/api/onu/reboot", data)
        return result is not None and result.get("success", False)
    
    def reset_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """
        Reset ONU ke factory default melalui REST API
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            True jika berhasil, False jika gagal
        """
        data = {
            "pon_port": pon_port,
            "onu_id": onu_id
        }
        result = self._make_request(olt, "POST", "/api/onu/reset", data)
        return result is not None and result.get("success", False)
    
    def create_pppoe_account(self, olt: Olt, pon_port: int, onu_id: int, pppoe_data: Dict) -> bool:
        """
        Membuat akun PPPoE pada ONU melalui REST API
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            pppoe_data: Data akun PPPoE (username, password, vlan_id, dll)
            
        Returns:
            True jika berhasil, False jika gagal
        """
        data = {
            "pon_port": pon_port,
            "onu_id": onu_id,
            **pppoe_data
        }
        result = self._make_request(olt, "POST", "/api/onu/pppoe/create", data)
        return result is not None and result.get("success", False)
    
    def get_onu_list(self, olt: Olt) -> List[Dict]:
        """
        Mendapatkan daftar ONU dari OLT melalui REST API
        
        Args:
            olt: Object OLT dari database
            
        Returns:
            List dictionary berisi data ONU
        """
        result = self._make_request(olt, "GET", "/api/onu/list")
        if result and "onus" in result:
            return result["onus"]
        return []
    
    def get_onu_status(self, olt: Olt, pon_port: int, onu_id: int) -> Optional[Dict]:
        """
        Mendapatkan status ONU dari OLT melalui REST API
        
        Args:
            olt: Object OLT dari database
            pon_port: Nomor port PON
            onu_id: ID ONU
            
        Returns:
            Dictionary berisi status ONU atau None jika error
        """
        result = self._make_request(olt, "GET", f"/api/onu/status?pon_port={pon_port}&onu_id={onu_id}")
        return result
    
    def get_olt_status(self, olt: Olt) -> Optional[Dict]:
        """
        Mendapatkan status OLT melalui REST API
        
        Args:
            olt: Object OLT dari database
            
        Returns:
            Dictionary berisi status OLT atau None jika error
        """
        result = self._make_request(olt, "GET", "/api/olt/status")
        return result

