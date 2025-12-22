"""
Service untuk integrasi dengan API Client
API Client: http://165.99.239.14:1661
"""
import requests
from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ClientApiService:
    """Service untuk komunikasi dengan API Client"""
    
    BASE_URL = "http://165.99.239.14:1661"
    TIMEOUT = 10  # seconds
    
    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or self.BASE_URL
    
    def _make_request(self, endpoint: str, method: str = "GET", params: Optional[Dict] = None, 
                     data: Optional[Dict] = None, headers: Optional[Dict] = None) -> Optional[Dict]:
        """Make HTTP request to client API"""
        url = f"{self.base_url}{endpoint}"
        
        default_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if headers:
            default_headers.update(headers)
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, params=params, headers=default_headers, timeout=self.TIMEOUT)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=self.TIMEOUT)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=default_headers, timeout=self.TIMEOUT)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=default_headers, timeout=self.TIMEOUT)
            else:
                logger.error(f"Unsupported HTTP method: {method}")
                return None
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.Timeout:
            logger.error(f"Timeout connecting to {url}")
            return None
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error to {url}")
            return None
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Error making request to {url}: {str(e)}")
            return None
    
    def get_health(self) -> Dict:
        """Check API health/status"""
        return self._make_request("/health") or {"status": "unavailable", "error": "Cannot connect to API"}
    
    def get_all_data(self) -> List[Dict]:
        """Get all data from client API"""
        # Adjust endpoint sesuai dengan API client yang sebenarnya
        # Contoh endpoint umum:
        # - /api/data
        # - /api/devices
        # - /api/status
        data = self._make_request("/api/data")
        if data:
            return data if isinstance(data, list) else [data]
        return []
    
    def get_devices(self) -> List[Dict]:
        """Get devices from client API"""
        data = self._make_request("/api/devices")
        if data:
            return data if isinstance(data, list) else [data]
        return []
    
    def get_status(self) -> Dict:
        """Get status from client API"""
        return self._make_request("/api/status") or {}
    
    def get_device_by_id(self, device_id: str) -> Optional[Dict]:
        """Get specific device by ID"""
        return self._make_request(f"/api/devices/{device_id}")
    
    def get_metrics(self) -> Dict:
        """Get metrics from client API"""
        return self._make_request("/api/metrics") or {}
    
    def get_custom_endpoint(self, endpoint: str, params: Optional[Dict] = None) -> Optional[Dict]:
        """Get data from custom endpoint"""
        return self._make_request(endpoint, params=params)

