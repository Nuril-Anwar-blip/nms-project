from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.database import get_db
from app.models import Olt, Onu, Alarm
from app.schemas import OltCreate, OltUpdate, OltResponse
from app.services.snmp_service import SnmpService
from datetime import datetime

router = APIRouter()
snmp_service = SnmpService()

@router.get("", response_model=List[OltResponse])
def get_olts(db: Session = Depends(get_db)):
    """Get all OLTs"""
    olts = db.query(Olt).all()
    return olts

@router.post("", response_model=OltResponse, status_code=201)
def create_olt(olt_data: OltCreate, db: Session = Depends(get_db)):
    """Create new OLT"""
    olt = Olt(**olt_data.model_dump())
    db.add(olt)
    db.commit()
    db.refresh(olt)
    return olt

@router.get("/{olt_id}", response_model=OltResponse)
def get_olt(olt_id: int, db: Session = Depends(get_db)):
    """Get OLT by ID"""
    olt = db.query(Olt).filter(Olt.id == olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    return olt

@router.put("/{olt_id}", response_model=OltResponse)
def update_olt(olt_id: int, olt_data: OltUpdate, db: Session = Depends(get_db)):
    """Update OLT"""
    olt = db.query(Olt).filter(Olt.id == olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    update_data = olt_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(olt, field, value)
    
    db.commit()
    db.refresh(olt)
    return olt

@router.delete("/{olt_id}")
def delete_olt(olt_id: int, db: Session = Depends(get_db)):
    """Delete OLT"""
    olt = db.query(Olt).filter(Olt.id == olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    db.delete(olt)
    db.commit()
    return {"message": "OLT deleted successfully"}

@router.get("/{olt_id}/status")
def get_olt_status(olt_id: int, db: Session = Depends(get_db)):
    """Get OLT status and system information"""
    olt = db.query(Olt).filter(Olt.id == olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    try:
        system_info = snmp_service.get_system_info(olt)
        olt.status = "online"
        olt.last_polled_at = datetime.now()
        db.commit()
        
        return {
            "status": "online",
            "system_info": system_info,
            "last_polled_at": olt.last_polled_at.isoformat()
        }
    except Exception as e:
        olt.status = "offline"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to get OLT status: {str(e)}")
