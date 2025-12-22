from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Olt, Onu, PppoeAccount
from app.schemas import (
    ProvisionOnuRequest, UpdateSerialRequest, UpdateNameRequest,
    PppoeAccountCreate
)
from app.services.snmp_service import SnmpService
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter()
snmp_service = SnmpService()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/onu", status_code=201)
def provision_onu(provision_data: ProvisionOnuRequest, db: Session = Depends(get_db)):
    """Provision ONU on OLT and database"""
    olt = db.query(Olt).filter(Olt.id == provision_data.olt_id).first()
    if not olt:
        raise HTTPException(status_code=404, detail="OLT not found")
    
    # Check if serial number already exists
    existing = db.query(Onu).filter(Onu.serial_number == provision_data.serial_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Serial number already exists")
    
    try:
        # Provision ONU on OLT via SNMP
        provisioned = snmp_service.provision_onu(
            olt,
            provision_data.pon_port,
            provision_data.onu_id,
            provision_data.serial_number
        )
        
        if not provisioned:
            raise HTTPException(status_code=500, detail="Failed to provision ONU on OLT")
        
        # Create ONU in database
        onu = Onu(
            olt_id=provision_data.olt_id,
            serial_number=provision_data.serial_number,
            name=provision_data.name,
            pon_port=provision_data.pon_port,
            onu_id=provision_data.onu_id,
            model=provision_data.model,
            location_id=provision_data.location_id,
            description=provision_data.description,
            status="online"
        )
        db.add(onu)
        db.flush()
        
        # Create PPPoE account if provided
        if provision_data.pppoe:
            # Create PPPoE on OLT
            pppoe_created = snmp_service.create_pppoe_account(
                olt,
                provision_data.pon_port,
                provision_data.onu_id,
                provision_data.pppoe
            )
            
            if pppoe_created:
                pppoe_account = PppoeAccount(
                    onu_id=onu.id,
                    username=provision_data.pppoe.get('username'),
                    password=pwd_context.hash(provision_data.pppoe.get('password')),
                    vlan_id=provision_data.pppoe.get('vlan_id'),
                    download_speed=provision_data.pppoe.get('download_speed'),
                    upload_speed=provision_data.pppoe.get('upload_speed'),
                )
                db.add(pppoe_account)
        
        db.commit()
        db.refresh(onu)
        return onu
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Provisioning failed: {str(e)}")

@router.delete("/onu/{onu_id}")
def delete_onu(onu_id: int, db: Session = Depends(get_db)):
    """Delete ONU from OLT and database"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    try:
        # Delete from OLT via SNMP
        deleted = snmp_service.delete_onu(onu.olt, onu.pon_port, onu.onu_id)
        
        if not deleted:
            raise HTTPException(status_code=500, detail="Failed to delete ONU from OLT")
        
        # Delete from database
        db.delete(onu)
        db.commit()
        return {"message": "ONU deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@router.put("/onu/{onu_id}/serial")
def update_serial(onu_id: int, update_data: UpdateSerialRequest, db: Session = Depends(get_db)):
    """Update ONU serial number"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    # Check if new serial already exists
    existing = db.query(Onu).filter(
        Onu.serial_number == update_data.serial_number,
        Onu.id != onu_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Serial number already exists")
    
    try:
        # Update on OLT via SNMP
        updated = snmp_service.update_onu_serial(
            onu.olt,
            onu.pon_port,
            onu.onu_id,
            update_data.serial_number
        )
        
        if not updated:
            raise HTTPException(status_code=500, detail="Failed to update serial number on OLT")
        
        # Update in database
        onu.serial_number = update_data.serial_number
        db.commit()
        db.refresh(onu)
        return onu
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@router.put("/onu/{onu_id}/name")
def update_name(onu_id: int, update_data: UpdateNameRequest, db: Session = Depends(get_db)):
    """Update ONU name"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    onu.name = update_data.name
    db.commit()
    db.refresh(onu)
    return onu

@router.post("/onu/{onu_id}/reboot")
def reboot_onu(onu_id: int, db: Session = Depends(get_db)):
    """Reboot ONU"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    try:
        rebooted = snmp_service.reboot_onu(onu.olt, onu.pon_port, onu.onu_id)
        if rebooted:
            return {"message": "ONU reboot command sent successfully"}
        raise HTTPException(status_code=500, detail="Failed to reboot ONU")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reboot failed: {str(e)}")

@router.post("/onu/{onu_id}/reset")
def reset_onu(onu_id: int, db: Session = Depends(get_db)):
    """Reset ONU to factory defaults"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    try:
        reset = snmp_service.reset_onu(onu.olt, onu.pon_port, onu.onu_id)
        if reset:
            return {"message": "ONU reset command sent successfully"}
        raise HTTPException(status_code=500, detail="Failed to reset ONU")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")

@router.post("/onu/{onu_id}/pppoe", status_code=201)
def create_pppoe(onu_id: int, pppoe_data: PppoeAccountCreate, db: Session = Depends(get_db)):
    """Create PPPoE account for ONU"""
    onu = db.query(Onu).filter(Onu.id == onu_id).first()
    if not onu:
        raise HTTPException(status_code=404, detail="ONU not found")
    
    try:
        # Create PPPoE on OLT
        created = snmp_service.create_pppoe_account(
            onu.olt,
            onu.pon_port,
            onu.onu_id,
            pppoe_data.model_dump()
        )
        
        if not created:
            raise HTTPException(status_code=500, detail="Failed to create PPPoE account on OLT")
        
        # Create in database
        pppoe_dict = pppoe_data.model_dump()
        pppoe_dict['onu_id'] = onu_id
        pppoe_dict['password'] = pwd_context.hash(pppoe_dict['password'])
        
        pppoe_account = PppoeAccount(**pppoe_dict)
        db.add(pppoe_account)
        db.commit()
        db.refresh(pppoe_account)
        return pppoe_account
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"PPPoE creation failed: {str(e)}")

