from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from app.database import get_db
from app.models import Olt, Onu, Alarm, Location

router = APIRouter()

@router.get("/olts")
def get_olts_for_map(db: Session = Depends(get_db)):
    """Get OLTs with location data for maps"""
    from sqlalchemy import func
    
    olts = db.query(
        Olt.id,
        Olt.name,
        Olt.ip_address,
        Olt.status,
        Olt.latitude,
        Olt.longitude,
        func.count(Onu.id).label('onus_count'),
        func.count(Alarm.id).filter(Alarm.status == 'active').label('active_alarms_count')
    ).outerjoin(Onu).outerjoin(Alarm).filter(
        Olt.latitude.isnot(None),
        Olt.longitude.isnot(None)
    ).group_by(Olt.id).all()
    
    return [
        {
            'id': olt.id,
            'name': olt.name,
            'ip_address': olt.ip_address,
            'status': olt.status,
            'latitude': float(olt.latitude) if olt.latitude else None,
            'longitude': float(olt.longitude) if olt.longitude else None,
            'onus_count': olt.onus_count or 0,
            'active_alarms_count': olt.active_alarms_count or 0,
        }
        for olt in olts
    ]

@router.get("/onus")
def get_onus_for_map(db: Session = Depends(get_db)):
    """Get ONUs with location data for maps"""
    onus = db.query(Onu).join(Location).filter(
        Location.latitude.isnot(None),
        Location.longitude.isnot(None)
    ).all()
    
    return [
        {
            'id': onu.id,
            'name': onu.name or onu.serial_number,
            'serial_number': onu.serial_number,
            'status': onu.status,
            'olt_name': onu.olt.name if onu.olt else None,
            'latitude': float(onu.location.latitude) if onu.location and onu.location.latitude else None,
            'longitude': float(onu.location.longitude) if onu.location and onu.location.longitude else None,
            'location_name': onu.location.name if onu.location else None,
        }
        for onu in onus
    ]

