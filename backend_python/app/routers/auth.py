"""
Authentication routes
Handles login, logout, user registration, and token refresh
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import User, UserRole, ActivityLog, ActivityType
from app.auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.schemas import UserCreate, UserResponse, Token, LoginRequest
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[UserRole] = UserRole.OPERATOR

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
    request: Optional[Request] = None
):
    """Login endpoint - returns JWT token"""
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    # Log activity
    activity_log = ActivityLog(
        user_id=user.id,
        activity_type=ActivityType.LOGIN,
        entity_type="user",
        entity_id=user.id,
        description=f"User {user.email} logged in",
        ip_address=request.get("client_host") if request else None
    )
    db.add(activity_log)
    db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.value
        }
    }

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Register a new user (admin only)"""
    # Only admin can create users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create users"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Log activity
    activity_log = ActivityLog(
        user_id=current_user.id,
        activity_type=ActivityType.CREATE,
        entity_type="user",
        entity_id=new_user.id,
        description=f"User {current_user.email} created new user {new_user.email}"
    )
    db.add(activity_log)
    db.commit()
    
    return new_user

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user information"""
    return current_user

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Logout endpoint - logs the activity"""
    activity_log = ActivityLog(
        user_id=current_user.id,
        activity_type=ActivityType.LOGOUT,
        entity_type="user",
        entity_id=current_user.id,
        description=f"User {current_user.email} logged out"
    )
    db.add(activity_log)
    db.commit()
    
    return {"message": "Logged out successfully"}

