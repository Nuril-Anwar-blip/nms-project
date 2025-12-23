"""
File: models.py

Definisi model database menggunakan SQLAlchemy ORM
Berisi semua tabel dan relasi database untuk aplikasi NMS

Struktur database:
- users: Data pengguna internal (admin/operator)
- olts: Data perangkat OLT dengan parameter akses
- pons: Data port PON pada OLT
- onus: Data ONU dengan status dan parameter optik
- pppoe_accounts: Data akun PPPoE hasil provisioning
- alarms: Data alarm dan event jaringan
- activity_logs: Log aktivitas operator untuk audit
- locations: Data lokasi geografis untuk maps
- olt_performance_logs: Log performa OLT (CPU, memory, temperature)
- onu_status_history: Histori perubahan status ONU

Relasi antar tabel:
- OLT -> ONU (one-to-many)
- OLT -> PON (one-to-many)
- OLT -> Alarm (one-to-many)
- ONU -> PPPoE Account (one-to-one)
- ONU -> Location (many-to-one)
- ONU -> Alarm (one-to-many)
- User -> Activity Log (one-to-many)

Catatan:
- Password disimpan dalam bentuk hash (bcrypt)
- Kredensial SSH dan API disimpan terenkripsi
- Timestamp menggunakan UTC untuk konsistensi
- Soft delete tidak digunakan, data dihapus langsung dari database
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, BigInteger, DateTime, DECIMAL, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class OltStatus(str, enum.Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    UNKNOWN = "unknown"

class OnuStatus(str, enum.Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    UNKNOWN = "unknown"

class AdminStatus(str, enum.Enum):
    ENABLED = "enabled"
    DISABLED = "disabled"

class AlarmSeverity(str, enum.Enum):
    CRITICAL = "critical"
    MAJOR = "major"
    MINOR = "minor"
    WARNING = "warning"
    INFO = "info"

class AlarmStatus(str, enum.Enum):
    ACTIVE = "active"
    CLEARED = "cleared"
    ACKNOWLEDGED = "acknowledged"

class PppoeStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    OPERATOR = "operator"

class ActivityType(str, enum.Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    PROVISION = "provision"
    REBOOT = "reboot"
    RESET = "reset"
    LOGIN = "login"
    LOGOUT = "logout"
    OTHER = "other"

class Olt(Base):
    __tablename__ = "olts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    hostname = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=False, unique=True, index=True)
    vendor = Column(String(100), default="ZTE")
    model = Column(String(255), nullable=True)  # C300, C320, etc.
    firmware_version = Column(String(100), nullable=True)
    snmp_community = Column(String(255), default="public")
    snmp_version = Column(Integer, default=2)  # 2 for v2c, 3 for v3
    snmp_port = Column(Integer, default=161)
    snmp_username = Column(String(255), nullable=True)  # For SNMP v3
    snmp_password = Column(String(255), nullable=True)  # For SNMP v3 (encrypted)
    ssh_username = Column(String(255), nullable=True)
    ssh_password = Column(String(500), nullable=True)  # Encrypted
    ssh_port = Column(Integer, default=22)
    api_endpoint = Column(String(500), nullable=True)  # REST API endpoint
    api_username = Column(String(255), nullable=True)
    api_password = Column(String(500), nullable=True)  # Encrypted
    location = Column(String(255), nullable=True)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    status = Column(Enum(OltStatus), default=OltStatus.UNKNOWN)
    cpu_usage = Column(Float, nullable=True)  # CPU usage percentage
    memory_usage = Column(Float, nullable=True)  # Memory usage percentage
    uptime = Column(BigInteger, nullable=True)  # Uptime in seconds
    temperature = Column(Float, nullable=True)  # Temperature in Celsius
    last_polled_at = Column(DateTime, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    onus = relationship("Onu", back_populates="olt", cascade="all, delete-orphan")
    alarms = relationship("Alarm", back_populates="olt", cascade="all, delete-orphan")
    pons = relationship("Pon", back_populates="olt", cascade="all, delete-orphan")
    performance_logs = relationship("OltPerformanceLog", back_populates="olt", cascade="all, delete-orphan")

class Pon(Base):
    __tablename__ = "pons"

    id = Column(Integer, primary_key=True, index=True)
    olt_id = Column(Integer, ForeignKey("olts.id", ondelete="CASCADE"), nullable=False)
    pon_port = Column(Integer, nullable=False)
    name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    max_onus = Column(Integer, default=64)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    olt = relationship("Olt", back_populates="pons")
    onus = relationship("Onu", back_populates="pon")

    __table_args__ = (
        {"mysql_engine": "InnoDB"},
    )

class Onu(Base):
    __tablename__ = "onus"

    id = Column(Integer, primary_key=True, index=True)
    olt_id = Column(Integer, ForeignKey("olts.id", ondelete="CASCADE"), nullable=False)
    pon_id = Column(Integer, ForeignKey("pons.id", ondelete="SET NULL"), nullable=True)
    serial_number = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    pon_port = Column(Integer, nullable=False)
    onu_id = Column(Integer, nullable=False)
    status = Column(Enum(OnuStatus), default=OnuStatus.UNKNOWN)
    admin_status = Column(Enum(AdminStatus), default=AdminStatus.ENABLED)
    model = Column(String(255), nullable=True)
    mac_address = Column(String(17), nullable=True)
    ip_address = Column(String(45), nullable=True)
    rx_power = Column(Float, nullable=True)  # Changed to Float for decimal values
    tx_power = Column(Float, nullable=True)  # Changed to Float for decimal values
    rx_bytes = Column(BigInteger, default=0)
    tx_bytes = Column(BigInteger, default=0)
    service_profile = Column(String(255), nullable=True)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=True)
    provisioned_at = Column(DateTime, nullable=True)  # When ONU was provisioned
    last_seen_at = Column(DateTime, nullable=True)
    last_status_change = Column(DateTime, nullable=True)  # Last status change timestamp
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    olt = relationship("Olt", back_populates="onus")
    pon = relationship("Pon", back_populates="onus")
    location = relationship("Location", back_populates="onus")
    alarms = relationship("Alarm", back_populates="onu", cascade="all, delete-orphan")
    pppoe_account = relationship("PppoeAccount", back_populates="onu", uselist=False, cascade="all, delete-orphan")
    status_history = relationship("OnuStatusHistory", back_populates="onu", cascade="all, delete-orphan")

    __table_args__ = (
        {"mysql_engine": "InnoDB"},
    )

class Alarm(Base):
    __tablename__ = "alarms"

    id = Column(Integer, primary_key=True, index=True)
    olt_id = Column(Integer, ForeignKey("olts.id", ondelete="CASCADE"), nullable=True)
    onu_id = Column(Integer, ForeignKey("onus.id", ondelete="CASCADE"), nullable=True)
    severity = Column(Enum(AlarmSeverity), default=AlarmSeverity.WARNING)
    type = Column(String(255), nullable=False)
    message = Column(String(500), nullable=False)
    details = Column(Text, nullable=True)
    status = Column(Enum(AlarmStatus), default=AlarmStatus.ACTIVE)
    occurred_at = Column(DateTime, nullable=False)
    cleared_at = Column(DateTime, nullable=True)
    acknowledged_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    olt = relationship("Olt", back_populates="alarms")
    onu = relationship("Onu", back_populates="alarms")
    acknowledged_by_user = relationship("User", back_populates="acknowledged_alarms", foreign_keys=[acknowledged_by])

class PppoeAccount(Base):
    __tablename__ = "pppoe_accounts"

    id = Column(Integer, primary_key=True, index=True)
    onu_id = Column(Integer, ForeignKey("onus.id", ondelete="CASCADE"), nullable=False)
    username = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    service_name = Column(String(255), nullable=True)
    vlan_id = Column(String(50), nullable=True)
    status = Column(Enum(PppoeStatus), default=PppoeStatus.ACTIVE)
    download_speed = Column(BigInteger, nullable=True)
    upload_speed = Column(BigInteger, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    onu = relationship("Onu", back_populates="pppoe_account")

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=True)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    city = Column(String(255), nullable=True)
    province = Column(String(255), nullable=True)
    postal_code = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    onus = relationship("Onu", back_populates="location")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Hashed password
    role = Column(Enum(UserRole), default=UserRole.OPERATOR)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    activity_logs = relationship("ActivityLog", back_populates="user")
    acknowledged_alarms = relationship("Alarm", back_populates="acknowledged_by_user", foreign_keys="Alarm.acknowledged_by")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    activity_type = Column(Enum(ActivityType), nullable=False)
    entity_type = Column(String(100), nullable=False)  # 'olt', 'onu', 'alarm', etc.
    entity_id = Column(Integer, nullable=True)
    description = Column(Text, nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="activity_logs")

class OnuStatusHistory(Base):
    __tablename__ = "onu_status_history"

    id = Column(Integer, primary_key=True, index=True)
    onu_id = Column(Integer, ForeignKey("onus.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(OnuStatus), nullable=False)
    rx_power = Column(Float, nullable=True)
    tx_power = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    onu = relationship("Onu", back_populates="status_history")

class OltPerformanceLog(Base):
    __tablename__ = "olt_performance_logs"

    id = Column(Integer, primary_key=True, index=True)
    olt_id = Column(Integer, ForeignKey("olts.id", ondelete="CASCADE"), nullable=False)
    cpu_usage = Column(Float, nullable=True)
    memory_usage = Column(Float, nullable=True)
    uptime = Column(BigInteger, nullable=True)
    temperature = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    olt = relationship("Olt", back_populates="performance_logs")

