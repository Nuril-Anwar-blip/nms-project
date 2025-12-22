from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Alarm
from app.schemas import AlarmCreate, AlarmResponse
from datetime import datetime

router = APIRouter()

@router.get("", response_model=List[AlarmResponse])
def get_alarms(
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    olt_id: Optional[int] = Query(None),
    onu_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all alarms with optional filters"""
    query = db.query(Alarm)
    
    if status:
        query = query.filter(Alarm.status == status)
    if severity:
        query = query.filter(Alarm.severity == severity)
    if olt_id:
        query = query.filter(Alarm.olt_id == olt_id)
    if onu_id:
        query = query.filter(Alarm.onu_id == onu_id)
    
    alarms = query.order_by(Alarm.occurred_at.desc()).all()
    return alarms

@router.post("", response_model=AlarmResponse, status_code=201)
def create_alarm(alarm_data: AlarmCreate, db: Session = Depends(get_db)):
    """Create new alarm"""
    alarm_dict = alarm_data.model_dump()
    if not alarm_dict.get('occurred_at'):
        alarm_dict['occurred_at'] = datetime.now()
    
    alarm = Alarm(**alarm_dict)
    db.add(alarm)
    db.commit()
    db.refresh(alarm)
    return alarm

@router.get("/{alarm_id}", response_model=AlarmResponse)
def get_alarm(alarm_id: int, db: Session = Depends(get_db)):
    """Get alarm by ID"""
    alarm = db.query(Alarm).filter(Alarm.id == alarm_id).first()
    if not alarm:
        raise HTTPException(status_code=404, detail="Alarm not found")
    return alarm

@router.put("/{alarm_id}", response_model=AlarmResponse)
def update_alarm(alarm_id: int, alarm_data: dict, db: Session = Depends(get_db)):
    """Update alarm"""
    alarm = db.query(Alarm).filter(Alarm.id == alarm_id).first()
    if not alarm:
        raise HTTPException(status_code=404, detail="Alarm not found")
    
    for field, value in alarm_data.items():
        if hasattr(alarm, field):
            setattr(alarm, field, value)
    
    db.commit()
    db.refresh(alarm)
    return alarm

@router.delete("/{alarm_id}")
def delete_alarm(alarm_id: int, db: Session = Depends(get_db)):
    """Delete alarm"""
    alarm = db.query(Alarm).filter(Alarm.id == alarm_id).first()
    if not alarm:
        raise HTTPException(status_code=404, detail="Alarm not found")
    
    db.delete(alarm)
    db.commit()
    return {"message": "Alarm deleted successfully"}

@router.post("/{alarm_id}/acknowledge", response_model=AlarmResponse)
def acknowledge_alarm(alarm_id: int, db: Session = Depends(get_db)):
    """Acknowledge alarm"""
    alarm = db.query(Alarm).filter(Alarm.id == alarm_id).first()
    if not alarm:
        raise HTTPException(status_code=404, detail="Alarm not found")
    
    alarm.status = "acknowledged"
    alarm.acknowledged_at = datetime.now()
    # alarm.acknowledged_by = current_user.id  # Implement auth later
    
    db.commit()
    db.refresh(alarm)
    return alarm

@router.post("/{alarm_id}/clear", response_model=AlarmResponse)
def clear_alarm(alarm_id: int, db: Session = Depends(get_db)):
    """Clear alarm"""
    alarm = db.query(Alarm).filter(Alarm.id == alarm_id).first()
    if not alarm:
        raise HTTPException(status_code=404, detail="Alarm not found")
    
    alarm.status = "cleared"
    alarm.cleared_at = datetime.now()
    
    db.commit()
    db.refresh(alarm)
    return alarm

