"""
Activity Log routes
Handles activity logging and audit trails
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import ActivityLog, User, ActivityType
from app.auth import get_current_active_user, RequireAdmin
from typing import List, Optional
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/activity-logs", tags=["Activity Logs"])

@router.get("")
async def get_activity_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    activity_type: Optional[ActivityType] = None,
    entity_type: Optional[str] = None,
    user_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get activity logs with filters"""
    query = db.query(ActivityLog)
    
    # Apply filters
    if activity_type:
        query = query.filter(ActivityLog.activity_type == activity_type)
    if entity_type:
        query = query.filter(ActivityLog.entity_type == entity_type)
    if user_id:
        # Only admins can filter by other users
        if current_user.role.value != "admin":
            query = query.filter(ActivityLog.user_id == current_user.id)
        else:
            query = query.filter(ActivityLog.user_id == user_id)
    else:
        # Non-admins only see their own logs
        if current_user.role.value != "admin":
            query = query.filter(ActivityLog.user_id == current_user.id)
    
    if start_date:
        query = query.filter(ActivityLog.created_at >= start_date)
    if end_date:
        query = query.filter(ActivityLog.created_at <= end_date)
    
    # Order by most recent first
    query = query.order_by(desc(ActivityLog.created_at))
    
    # Pagination
    total = query.count()
    logs = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "logs": logs
    }

@router.get("/stats")
async def get_activity_stats(
    days: int = Query(7, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(RequireAdmin)
):
    """Get activity statistics (admin only)"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get activity counts by type
    activity_counts = {}
    for activity_type in ActivityType:
        count = db.query(ActivityLog).filter(
            ActivityLog.activity_type == activity_type,
            ActivityLog.created_at >= start_date
        ).count()
        activity_counts[activity_type.value] = count
    
    # Get activity by user
    user_activities = db.query(
        ActivityLog.user_id,
        User.name,
        User.email,
        db.func.count(ActivityLog.id).label('count')
    ).join(
        User, ActivityLog.user_id == User.id
    ).filter(
        ActivityLog.created_at >= start_date
    ).group_by(
        ActivityLog.user_id, User.name, User.email
    ).all()
    
    return {
        "period_days": days,
        "activity_by_type": activity_counts,
        "activity_by_user": [
            {
                "user_id": ua.user_id,
                "name": ua.name,
                "email": ua.email,
                "count": ua.count
            }
            for ua in user_activities
        ]
    }

