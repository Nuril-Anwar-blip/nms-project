"""
File: auth.py

Modul autentikasi dan autorisasi menggunakan JWT
Menangani pembuatan token, validasi token, dan autentikasi user

Fungsi utama:
- Verifikasi password menggunakan bcrypt
- Hash password untuk penyimpanan aman
- Membuat JWT access token
- Validasi JWT token dari request
- Dependency injection untuk protected routes
- Role-based access control (admin/operator)

Alur autentikasi:
1. User login dengan email dan password
2. Password diverifikasi dengan hash di database
3. Jika valid, JWT token dibuat dengan payload (email, role)
4. Token dikembalikan ke frontend
5. Frontend menyimpan token dan mengirim di header setiap request
6. Backend memvalidasi token di setiap protected route

Konfigurasi:
- SECRET_KEY: Kunci untuk signing JWT (harus diubah di production)
- ALGORITHM: Algoritma signing (HS256)
- ACCESS_TOKEN_EXPIRE_MINUTES: Masa berlaku token (default 24 jam)

Dependencies:
- get_current_user: Dependency untuk mendapatkan user dari token
- get_current_active_user: Dependency untuk memastikan user aktif
- require_role: Dependency untuk memeriksa role user
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, UserRole

# Configuration
SECRET_KEY = "your-secret-key-change-in-production-use-env-variable"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not user.is_active:
        return None
    if not verify_password(password, user.password):
        return None
    return user

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    return current_user

def require_role(allowed_roles: list[UserRole]):
    """Dependency to require specific user roles"""
    async def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Convenience dependencies
RequireAdmin = require_role([UserRole.ADMIN])
RequireOperator = require_role([UserRole.OPERATOR, UserRole.ADMIN])

