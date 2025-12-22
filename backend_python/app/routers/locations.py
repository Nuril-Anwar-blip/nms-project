from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Location
from app.schemas import LocationCreate, LocationResponse

router = APIRouter()

@router.get("", response_model=List[LocationResponse])
def get_locations(db: Session = Depends(get_db)):
    """Get all locations"""
    locations = db.query(Location).all()
    return locations

@router.post("", response_model=LocationResponse, status_code=201)
def create_location(location_data: LocationCreate, db: Session = Depends(get_db)):
    """Create new location"""
    location = Location(**location_data.model_dump())
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

@router.get("/{location_id}", response_model=LocationResponse)
def get_location(location_id: int, db: Session = Depends(get_db)):
    """Get location by ID"""
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.put("/{location_id}", response_model=LocationResponse)
def update_location(location_id: int, location_data: LocationCreate, db: Session = Depends(get_db)):
    """Update location"""
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    update_data = location_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(location, field, value)
    
    db.commit()
    db.refresh(location)
    return location

@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    """Delete location"""
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    db.delete(location)
    db.commit()
    return {"message": "Location deleted successfully"}

