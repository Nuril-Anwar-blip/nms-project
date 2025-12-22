from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, BigInteger, DateTime, DECIMAL
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

class Olt(Base):
    __tablename__ = "olts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=False)
    model = Column(String(255), nullable=True)
    snmp_community = Column(String(255), default="public")
    snmp_version = Column(Integer, default=2)
    snmp_port = Column(Integer, default=161)
    username = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    status = Column(Enum(OltStatus), default=OltStatus.UNKNOWN)
    last_polled_at = Column(DateTime, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    onus = relationship("Onu", back_populates="olt", cascade="all, delete-orphan")
    alarms = relationship("Alarm", back_populates="olt", cascade="all, delete-orphan")

class Onu(Base):
    __tablename__ = "onus"

    id = Column(Integer, primary_key=True, index=True)
    olt_id = Column(Integer, ForeignKey("olts.id", ondelete="CASCADE"), nullable=False)
    serial_number = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    pon_port = Column(Integer, nullable=False)
    onu_id = Column(Integer, nullable=False)
    status = Column(Enum(OnuStatus), default=OnuStatus.UNKNOWN)
    admin_status = Column(Enum(AdminStatus), default=AdminStatus.ENABLED)
    model = Column(String(255), nullable=True)
    mac_address = Column(String(17), nullable=True)
    ip_address = Column(String(45), nullable=True)
    rx_power = Column(Integer, nullable=True)
    tx_power = Column(Integer, nullable=True)
    rx_bytes = Column(BigInteger, default=0)
    tx_bytes = Column(BigInteger, default=0)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=True)
    last_seen_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    olt = relationship("Olt", back_populates="onus")
    location = relationship("Location", back_populates="onus")
    alarms = relationship("Alarm", back_populates="onu", cascade="all, delete-orphan")
    pppoe_account = relationship("PppoeAccount", back_populates="onu", uselist=False, cascade="all, delete-orphan")

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
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

