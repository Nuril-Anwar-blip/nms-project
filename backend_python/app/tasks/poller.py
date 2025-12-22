"""
Background task for SNMP polling
Can be run as a separate process or integrated with FastAPI BackgroundTasks
"""
import asyncio
import time
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Olt, Onu
from app.services.snmp_service import SnmpService
from datetime import datetime
from typing import List

snmp_service = SnmpService()

async def poll_olt_async(olt: Olt, db: Session):
    """Poll single OLT asynchronously"""
    try:
        # Get system info
        system_info = snmp_service.get_system_info(olt)
        if system_info.get('sysUpTime'):
            olt.status = "online"
            olt.last_polled_at = datetime.now()
        else:
            olt.status = "offline"
        
        db.commit()
        
        # Get ONU list
        onu_list = snmp_service.get_onu_list(olt)
        
        # Sync ONUs
        for onu_data in onu_list:
            onu = db.query(Onu).filter(
                Onu.olt_id == olt.id,
                Onu.pon_port == onu_data['pon_port'],
                Onu.onu_id == onu_data['onu_id']
            ).first()
            
            if onu:
                onu.status = onu_data['status']
                onu.rx_power = onu_data.get('rx_power')
                onu.tx_power = onu_data.get('tx_power')
                onu.last_seen_at = datetime.now()
            else:
                onu = Onu(
                    olt_id=olt.id,
                    serial_number=onu_data['serial_number'],
                    pon_port=onu_data['pon_port'],
                    onu_id=onu_data['onu_id'],
                    status=onu_data['status'],
                    rx_power=onu_data.get('rx_power'),
                    tx_power=onu_data.get('tx_power'),
                    last_seen_at=datetime.now()
                )
                db.add(onu)
        
        db.commit()
        print(f"[INFO] Polled OLT {olt.name} - {len(onu_list)} ONUs found")
        
    except Exception as e:
        print(f"[ERROR] Failed to poll OLT {olt.name}: {e}")
        olt.status = "offline"
        db.commit()

async def poll_all_olts():
    """Poll all OLTs continuously"""
    db = SessionLocal()
    try:
        while True:
            olts = db.query(Olt).all()
            if olts:
                tasks = [poll_olt_async(olt, db) for olt in olts]
                await asyncio.gather(*tasks, return_exceptions=True)
            else:
                print("[WARNING] No OLTs found")
            
            await asyncio.sleep(30)  # Poll every 30 seconds
    except KeyboardInterrupt:
        print("[INFO] Polling stopped")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(poll_all_olts())

