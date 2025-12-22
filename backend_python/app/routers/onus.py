from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Onu, Olt
from app.schemas import OnuCreate, OnuUpdate, OnuResponse, OnuSyncRequest, OnuSyncItem
from app.services.snmp_service import SnmpService
from datetime import datetime

router = APIRouter()
snmp_service = SnmpService()

@router.get("", response_model=List[OnuResponse])
def get_onus(
    olt_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all ONUs with optional filters"""
    query = db.query(Onu)
    
    if olt_id:
        query = query.filter(Onu.olt_id == olt_id)
    if status:
        query = query.filter(Onu.status == status)
    
    onus = query.all()
    return onus

@router.post("", response_model=OnuResponse, status_code=201)
def create_onu(onu_data: OnuCreate, db: Session = Depends(get_db)):
    """Create new ONU"""
    # Check if OLT exists
    olt = db.query(Olt).filter(Olt.id == onu_data.olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    # Check if serial number already exists
    existing = db.query(Onu).filter(Onu.serial_number == onu_data.serial_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Serial number already exists")
    
    onu = Onu(**onu_data.model_dump())
    db.add(onu)
    db.commit()
    db.refresh(onu)
    return onu

@router.get("/{onu_id}", response_model=OnuResponse)
def get_onu(onu_id: int, db: Session = Depends(get_db)):
    """Get ONU by ID"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    return onu

@router.put("/{onu_id}", response_model=OnuResponse)
def update_onu(onu_id: int, onu_data: OnuUpdate, db: Session = Depends(get_db)):
    """Update ONU"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    update_data = onu_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(onu, field, value)
    
    db.commit()
    db.refresh(onu)
    return onu

@router.delete("/{onu_id}")
def delete_onu(onu_id: int, db: Session = Depends(get_db)):
    """Delete ONU"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    db.delete(onu)
    db.commit()
    return {"message": "ONU deleted successfully"}

@router.post("/sync")
def sync_onus(sync_data: OnuSyncRequest, db: Session = Depends(get_db)):
    """Sync ONUs from poller"""
    synced = 0
    updated = 0
    
    for onu_data in sync_data.onus:
        onu = db.query(Onu).filter(
            Onu.olt_id == onu_data.olt_id,
            Onu.pon_port == onu_data.pon_port,
            Onu.onu_id == onu_data.onu_id
        ).first()
        
        if onu:
            # Update existing
            onu.status = onu_data.status
            if onu_data.rx_power is not None:
                onu.rx_power = onu_data.rx_power
            if onu_data.tx_power is not None:
                onu.tx_power = onu_data.tx_power
            if onu_data.rx_bytes is not None:
                onu.rx_bytes = onu_data.rx_bytes
            if onu_data.tx_bytes is not None:
                onu.tx_bytes = onu_data.tx_bytes
            onu.last_seen_at = datetime.now()
            updated += 1
        else:
            # Create new
            onu = Onu(
                olt_id=onu_data.olt_id,
                serial_number=onu_data.serial_number,
                pon_port=onu_data.pon_port,
                onu_id=onu_data.onu_id,
                status=onu_data.status,
                rx_power=onu_data.rx_power,
                tx_power=onu_data.tx_power,
                rx_bytes=onu_data.rx_bytes or 0,
                tx_bytes=onu_data.tx_bytes or 0,
                last_seen_at=datetime.now()
            )
            db.add(onu)
            synced += 1
    
    db.commit()
    return {
        "message": "ONUs synced successfully",
        "created": synced,
        "updated": updated
    }

