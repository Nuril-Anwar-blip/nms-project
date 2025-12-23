"""
File: schemas.py

Definisi Pydantic schemas untuk validasi request dan response API
Menggunakan Pydantic untuk validasi data dan serialization

Fungsi:
- Validasi data input dari frontend
- Serialization data output ke frontend
- Type checking dan validation otomatis
- Dokumentasi API otomatis (OpenAPI/Swagger)

Struktur schemas:
- Base schemas: Schema dasar untuk setiap entity
- Create schemas: Schema untuk create operation (tanpa ID, timestamps)
- Update schemas: Schema untuk update operation (semua field optional)
- Response schemas: Schema untuk response API (dengan ID, timestamps)

Catatan:
- Semua field required di Base/Create schemas
- Semua field optional di Update schemas
- Response schemas menggunakan from_attributes=True untuk SQLAlchemy models
- Enum types digunakan untuk field dengan nilai terbatas
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models import OltStatus, OnuStatus, AlarmSeverity, AlarmStatus, PppoeStatus, AdminStatus

# OLT Schemas
class OltBase(BaseModel):
    name: str
    ip_address: str
    model: Optional[str] = None
    snmp_community: str = "public"
    snmp_version: int = 2
    snmp_port: int = 161
    username: Optional[str] = None
    password: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None

class OltCreate(OltBase):
    pass

class OltUpdate(BaseModel):
    name: Optional[str] = None
    ip_address: Optional[str] = None
    model: Optional[str] = None
    snmp_community: Optional[str] = None
    snmp_version: Optional[int] = None
    snmp_port: Optional[int] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    status: Optional[OltStatus] = None

class OltResponse(OltBase):
    id: int
    status: OltStatus
    last_polled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ONU Schemas
class OnuBase(BaseModel):
    serial_number: str
    name: Optional[str] = None
    pon_port: int
    onu_id: int
    model: Optional[str] = None
    mac_address: Optional[str] = None
    location_id: Optional[int] = None
    description: Optional[str] = None

class OnuCreate(OnuBase):
    olt_id: int

class OnuUpdate(BaseModel):
    name: Optional[str] = None
    pon_port: Optional[int] = None
    onu_id: Optional[int] = None
    model: Optional[str] = None
    mac_address: Optional[str] = None
    location_id: Optional[int] = None
    description: Optional[str] = None
    admin_status: Optional[AdminStatus] = None

class OnuResponse(OnuBase):
    id: int
    olt_id: int
    status: OnuStatus
    admin_status: AdminStatus
    rx_power: Optional[int] = None
    tx_power: Optional[int] = None
    rx_bytes: int
    tx_bytes: int
    last_seen_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Alarm Schemas
class AlarmBase(BaseModel):
    severity: AlarmSeverity = AlarmSeverity.WARNING
    type: str
    message: str
    details: Optional[str] = None

class AlarmCreate(AlarmBase):
    olt_id: Optional[int] = None
    onu_id: Optional[int] = None
    occurred_at: Optional[datetime] = None

class AlarmResponse(AlarmBase):
    id: int
    olt_id: Optional[int] = None
    onu_id: Optional[int] = None
    status: AlarmStatus
    occurred_at: datetime
    cleared_at: Optional[datetime] = None
    acknowledged_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# PPPoE Schemas
class PppoeAccountBase(BaseModel):
    username: str
    password: str
    service_name: Optional[str] = None
    vlan_id: Optional[str] = None
    download_speed: Optional[int] = None
    upload_speed: Optional[int] = None
    expires_at: Optional[datetime] = None
    notes: Optional[str] = None

class PppoeAccountCreate(PppoeAccountBase):
    onu_id: int

class PppoeAccountResponse(PppoeAccountBase):
    id: int
    onu_id: int
    status: PppoeStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Location Schemas
class LocationBase(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    description: Optional[str] = None

class LocationCreate(LocationBase):
    pass

class LocationResponse(LocationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Provisioning Schemas
class ProvisionOnuRequest(BaseModel):
    olt_id: int
    serial_number: str
    pon_port: int
    onu_id: int
    name: Optional[str] = None
    model: Optional[str] = None
    location_id: Optional[int] = None
    description: Optional[str] = None
    pppoe: Optional[dict] = None

class UpdateSerialRequest(BaseModel):
    serial_number: str

class UpdateNameRequest(BaseModel):
    name: str

# Sync Schema
class OnuSyncItem(BaseModel):
    olt_id: int
    serial_number: str
    pon_port: int
    onu_id: int
    status: OnuStatus
    rx_power: Optional[int] = None
    tx_power: Optional[int] = None
    rx_bytes: Optional[int] = 0
    tx_bytes: Optional[int] = 0

class OnuSyncRequest(BaseModel):
    onus: List[OnuSyncItem]

# Authentication Schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[str] = "operator"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class LoginRequest(BaseModel):
    email: str
    password: str

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_olts: int
    online_olts: int
    offline_olts: int
    total_onus: int
    online_onus: int
    offline_onus: int
    active_alarms: int
    critical_alarms: int
    major_alarms: int
    minor_alarms: int

class OltPerformance(BaseModel):
    id: int
    name: str
    ip_address: str
    status: OltStatus
    cpu_usage: Optional[float] = None
    memory_usage: Optional[float] = None
    uptime: Optional[int] = None
    temperature: Optional[float] = None
    last_polled_at: Optional[datetime] = None

