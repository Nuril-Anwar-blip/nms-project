"""
Monitoring routes
Handles real-time monitoring, polling, and status checks
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Olt, Onu, User
from app.services.olt_service import OltService
from app.auth import get_current_active_user
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/monitoring", tags=["Monitoring"])
olt_service = OltService()

@router.post("/olt/{olt_id}/poll")
async def poll_olt(
    olt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Poll OLT for status and performance metrics"""
    olt = db.query(Olt).filter(Olt.id == olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    result = olt_service.poll_olt(olt, db)
    return result

@router.post("/olt/{olt_id}/sync-onus")
async def sync_onus(
    olt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Sync ONUs from OLT to database"""
    olt = db.query(Olt).filter(Olt.id == olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    result = olt_service.sync_onus(olt, db)
    return result

@router.get("/olt/{olt_id}/onus")
async def get_olt_onus(
    olt_id: int,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all ONUs for a specific OLT"""
    olt = db.query(Olt).filter(Olt.id == olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    query = db.query(Onu).filter(Onu.olt_id == olt_id)
    if status:
        query = query.filter(Onu.status == status)
    
    onus = query.all()
    return onus

@router.get("/onu/{onu_id}/status")
async def get_onu_status(
    onu_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get detailed ONU status"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    # Get real-time status from OLT
    try:
        olt = onu.olt
        # Try to get updated status via SNMP
        snmp_service = olt_service.snmp
        onu_list = snmp_service.get_onu_list(olt)
        
        for onu_data in onu_list:
            if (onu_data.get('pon_port') == onu.pon_port and 
                onu_data.get('onu_id') == onu.onu_id):
                # Update ONU with latest data
                onu.status = onu_data.get('status', onu.status)
                onu.rx_power = onu_data.get('rx_power')
                onu.tx_power = onu_data.get('tx_power')
                onu.last_seen_at = datetime.utcnow()
                db.commit()
                break
    except Exception as e:
        print(f"Error getting real-time ONU status: {e}")
    
    return onu

