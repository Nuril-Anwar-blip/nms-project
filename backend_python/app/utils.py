"""
File: utils.py

Fungsi utility untuk aplikasi NMS
Berisi helper functions yang digunakan di berbagai bagian aplikasi

Fungsi utama:
- log_activity: Mencatat aktivitas user ke database
- Helper functions lainnya untuk operasi umum

Catatan:
- Fungsi utility dibuat reusable untuk menghindari duplikasi kode
- Semua fungsi utility harus thread-safe jika digunakan di async context
"""
from sqlalchemy.orm import Session
from app.models import ActivityLog, ActivityType, User
from typing import Optional
from fastapi import Request

def log_activity(
    db: Session,
    user: User,
    activity_type: ActivityType,
    entity_type: str,
    entity_id: Optional[int],
    description: str,
    request: Optional[Request] = None
):
    """Log user activity"""
    activity_log = ActivityLog(
        user_id=user.id,
        activity_type=activity_type,
        entity_type=entity_type,
        entity_id=entity_id,
        description=description,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get("user-agent") if request else None
    )
    db.add(activity_log)
    db.commit()

