"""
File: main.py

Entry point aplikasi FastAPI untuk NMS ZTE OLT
File ini melakukan inisialisasi server API dan konfigurasi middleware

Fungsi utama:
- Membuat instance FastAPI application
- Mengkonfigurasi CORS middleware untuk komunikasi dengan frontend
- Mendaftarkan semua router (endpoint API)
- Membuat tabel database jika belum ada
- Menyediakan endpoint health check

Struktur routing:
- /api/auth/* - Autentikasi (login, logout, register)
- /api/dashboard/* - Statistik dashboard
- /api/monitoring/* - Monitoring dan polling OLT/ONU
- /api/olts/* - Manajemen OLT
- /api/onus/* - Manajemen ONU
- /api/provisioning/* - Provisioning ONU
- /api/alarms/* - Manajemen alarm
- /api/activity-logs/* - Log aktivitas
- /api/locations/* - Manajemen lokasi
- /api/maps/* - Data untuk maps

Server berjalan di port 8000 (default) dan dapat diakses dari frontend
melalui reverse proxy (Nginx) dengan SSL/TLS.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import (
    olts, onus, alarms, provisioning, locations, maps, 
    client_api, auth, dashboard, monitoring, activity_logs
)

# Membuat tabel database jika belum ada
# Menggunakan SQLAlchemy untuk auto-create schema
Base.metadata.create_all(bind=engine)

# Inisialisasi FastAPI application
app = FastAPI(
    title="NMS ZTE OLT API",
    description="Network Management System for ZTE OLT - Backend API",
    version="1.0.0"
)

# Konfigurasi CORS middleware
# Memungkinkan frontend React untuk mengakses API dari origin yang berbeda
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mendaftarkan semua router (endpoint API)
app.include_router(auth.router)  # Autentikasi: /api/auth/*
app.include_router(dashboard.router)  # Dashboard: /api/dashboard/*
app.include_router(monitoring.router)  # Monitoring: /api/monitoring/*
app.include_router(activity_logs.router)  # Activity logs: /api/activity-logs/*
app.include_router(olts.router, prefix="/api/olts", tags=["OLTs"])  # OLT management: /api/olts/*
app.include_router(onus.router, prefix="/api/onus", tags=["ONUs"])  # ONU management: /api/onus/*
app.include_router(alarms.router, prefix="/api/alarms", tags=["Alarms"])  # Alarm management: /api/alarms/*
app.include_router(provisioning.router, prefix="/api/provisioning", tags=["Provisioning"])  # Provisioning: /api/provisioning/*
app.include_router(locations.router, prefix="/api/locations", tags=["Locations"])  # Location management: /api/locations/*
app.include_router(maps.router, prefix="/api/maps", tags=["Maps"])  # Maps data: /api/maps/*
app.include_router(client_api.router, tags=["Client API"])  # Client API: /api/client/*

@app.get("/")
async def root():
    """
    Root endpoint - Informasi dasar API
    
    Returns:
        Dictionary berisi nama aplikasi dan versi
    """
    return {"message": "NMS ZTE OLT API", "version": "1.0.0"}

@app.get("/api/health")
async def health():
    """
    Health check endpoint
    
    Digunakan untuk monitoring status API
    Dapat digunakan oleh load balancer atau monitoring tools
    
    Returns:
        Dictionary dengan status "healthy"
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    """
    Menjalankan server development
    Untuk production, gunakan uvicorn atau gunicorn dengan worker
    """
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
