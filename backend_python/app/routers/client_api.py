"""
Router untuk integrasi dengan API Client
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict
from app.services.client_api_service import ClientApiService

router = APIRouter(prefix="/api/client", tags=["Client API"])
client_api = ClientApiService()

@router.get("/health")
async def check_client_api_health():
    """Check health status of client API"""
    result = client_api.get_health()
    return result

@router.get("/data")
async def get_client_data():
    """Get all data from client API"""
    data = client_api.get_all_data()
    return {
        "success": True,
        "count": len(data),
        "data": data,
        "source": "165.99.239.14:1661"
    }

@router.get("/devices")
async def get_client_devices():
    """Get devices from client API"""
    devices = client_api.get_devices()
    return {
        "success": True,
        "count": len(devices),
        "devices": devices,
        "source": "165.99.239.14:1661"
    }

@router.get("/devices/{device_id}")
async def get_client_device(device_id: str):
    """Get specific device from client API"""
    device = client_api.get_device_by_id(device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return {
        "success": True,
        "device": device,
        "source": "165.99.239.14:1661"
    }

@router.get("/status")
async def get_client_status():
    """Get status from client API"""
    status = client_api.get_status()
    return {
        "success": True,
        "status": status,
        "source": "165.99.239.14:1661"
    }

@router.get("/metrics")
async def get_client_metrics():
    """Get metrics from client API"""
    metrics = client_api.get_metrics()
    return {
        "success": True,
        "metrics": metrics,
        "source": "165.99.239.14:1661"
    }

@router.get("/custom")
async def get_custom_endpoint(
    endpoint: str = Query(..., description="Custom endpoint path, e.g., /api/custom/data"),
    param1: Optional[str] = Query(None),
    param2: Optional[str] = Query(None)
):
    """Get data from custom endpoint"""
    params = {}
    if param1:
        params["param1"] = param1
    if param2:
        params["param2"] = param2
    
    data = client_api.get_custom_endpoint(endpoint, params=params if params else None)
    if not data:
        raise HTTPException(status_code=404, detail="Endpoint not found or unavailable")
    
    return {
        "success": True,
        "endpoint": endpoint,
        "data": data,
        "source": "165.99.239.14:1661"
    }

@router.get("/test")
async def test_client_connection():
    """Test connection to client API"""
    health = client_api.get_health()
    devices = client_api.get_devices()
    status = client_api.get_status()
    
    return {
        "success": True,
        "connection": "ok" if health.get("status") != "unavailable" else "failed",
        "health": health,
        "devices_count": len(devices),
        "status": status,
        "api_url": "165.99.239.14:1661"
    }

