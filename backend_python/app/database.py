"""
File: database.py

Konfigurasi koneksi database MySQL menggunakan SQLAlchemy
Mengatur connection pool, session management, dan base class untuk models

Fungsi utama:
- Membuat engine SQLAlchemy untuk koneksi MySQL
- Mengatur session factory untuk database operations
- Menyediakan dependency injection untuk FastAPI routes
- Mengkonfigurasi connection pooling untuk performa optimal

Environment variables:
- DATABASE_URL: Connection string MySQL (format: mysql+pymysql://user:pass@host:port/dbname)

Connection pooling:
- pool_pre_ping: Test koneksi sebelum digunakan
- pool_recycle: Recycle connection setiap 300 detik untuk menghindari timeout
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables dari file .env
load_dotenv()

# Database URL dari environment variable
# Format: mysql+pymysql://username:password@host:port/database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://nms:nms_pass@mysql:3306/nms"
)

# Membuat SQLAlchemy engine
# pool_pre_ping: Test koneksi sebelum digunakan untuk menghindari connection error
# pool_recycle: Recycle connection setiap 300 detik untuk menghindari MySQL timeout
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set True untuk debug SQL queries
)

# Session factory untuk membuat database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class untuk semua database models
Base = declarative_base()

def get_db():
    """
    Dependency function untuk FastAPI
    Menyediakan database session untuk setiap request
    
    Yields:
        Database session yang akan otomatis ditutup setelah request selesai
        
    Usage:
        @router.get("/endpoint")
        def my_endpoint(db: Session = Depends(get_db)):
            # Gunakan db untuk query database
            pass
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
