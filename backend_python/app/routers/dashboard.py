"""
Dashboard routes
Provides summary statistics and real-time monitoring data
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Olt, Onu, Alarm, AlarmSeverity, AlarmStatus, OltStatus, OnuStatus
from app.schemas import DashboardStats, OltPerformance
from app.auth import get_current_active_user
from app.models import User
from typing import List

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get dashboard statistics"""
    # OLT stats
    total_olts = db.query(Olt).count()
    online_olts = db.query(Olt).filter(Olt.status == OltStatus.ONLINE).count()
    offline_olts = db.query(Olt).filter(Olt.status == OltStatus.OFFLINE).count()
    
    # ONU stats
    total_onus = db.query(Onu).count()
    online_onus = db.query(Onu).filter(Onu.status == OnuStatus.ONLINE).count()
    offline_onus = db.query(Onu).filter(Onu.status == OnuStatus.OFFLINE).count()
    
    # Alarm stats
    active_alarms = db.query(Alarm).filter(Alarm.status == AlarmStatus.ACTIVE).count()
    critical_alarms = db.query(Alarm).filter(
        Alarm.status == AlarmStatus.ACTIVE,
        Alarm.severity == AlarmSeverity.CRITICAL
    ).count()
    major_alarms = db.query(Alarm).filter(
        Alarm.status == AlarmStatus.ACTIVE,
        Alarm.severity == AlarmSeverity.MAJOR
    ).count()
    minor_alarms = db.query(Alarm).filter(
        Alarm.status == AlarmStatus.ACTIVE,
        Alarm.severity == AlarmSeverity.MINOR
    ).count()
    
    return DashboardStats(
        total_olts=total_olts,
        online_olts=online_olts,
        offline_olts=offline_olts,
        total_onus=total_onus,
        online_onus=online_onus,
        offline_onus=offline_onus,
        active_alarms=active_alarms,
        critical_alarms=critical_alarms,
        major_alarms=major_alarms,
        minor_alarms=minor_alarms
    )

@router.get("/olt-performance", response_model=List[OltPerformance])
async def get_olt_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get OLT performance metrics"""
    olts = db.query(Olt).all()
    
    performance_list = []
    for olt in olts:
        performance_list.append(OltPerformance(
            id=olt.id,
            name=olt.name,
            ip_address=olt.ip_address,
            status=olt.status,
            cpu_usage=olt.cpu_usage,
            memory_usage=olt.memory_usage,
            uptime=olt.uptime,
            temperature=olt.temperature,
            last_polled_at=olt.last_polled_at
        ))
    
    return performance_list

@router.get("/recent-alarms")
async def get_recent_alarms(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get recent alarms"""
    alarms = db.query(Alarm).filter(
        Alarm.status == AlarmStatus.ACTIVE
    ).order_by(Alarm.occurred_at.desc()).limit(limit).all()
    
    return alarms

@router.get("/recent-onus")
async def get_recent_onus(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get recently updated ONUs"""
    onus = db.query(Onu).order_by(Onu.updated_at.desc()).limit(limit).all()
    return onus

