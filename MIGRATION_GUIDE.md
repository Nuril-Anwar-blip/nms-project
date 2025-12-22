# Migration Guide: Laravel → Python FastAPI

## Overview

Backend telah dimigrasikan dari Laravel (PHP) ke FastAPI (Python).

## Perubahan Struktur

### Backend
- **Lama**: `backend/` (Laravel PHP)
- **Baru**: `backend_python/` (FastAPI Python)

### Endpoint API
Semua endpoint API tetap sama, jadi frontend tidak perlu diubah:
- `/api/olts`
- `/api/onus`
- `/api/alarms`
- `/api/provisioning/*`
- `/api/locations`
- `/api/maps/*`

## Setup Baru

### 1. Install Dependencies
```bash
cd backend_python
pip install -r requirements.txt
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan konfigurasi yang sesuai
```

### 3. Database Migration
```bash
# Generate migration (jika belum)
alembic revision --autogenerate -m "Initial migration"

# Run migration
alembic upgrade head
```

### 4. Run Development Server
```bash
# Option 1: Direct
uvicorn main:app --reload

# Option 2: Docker Compose
docker-compose up backend
```

## Docker Compose

Update `docker-compose.yml` sudah dilakukan:
- Service `php` dan `nginx` dihapus
- Service `backend` baru menggunakan Python FastAPI
- Port tetap `8000`

## Keuntungan Migrasi

1. **SNMP Native**: Python memiliki library SNMP terbaik (PySNMP)
2. **Simplifikasi**: Backend dan worker dalam satu bahasa (Python)
3. **Performance**: FastAPI sangat cepat untuk API
4. **Async Support**: Native async/await untuk real-time
5. **Type Safety**: Pydantic untuk validasi data

## Frontend

Frontend **TIDAK PERLU DIUBAH** karena:
- Endpoint API sama
- Response format sama (JSON)
- CORS sudah dikonfigurasi

Hanya perlu pastikan `VITE_API_BASE` di frontend mengarah ke `http://localhost:8000/api`

## Worker

Worker Python tetap bisa digunakan, hanya perlu update:
- `LARAVEL_API` → `API_URL` atau langsung ke `http://backend:8000/api`

## Testing

1. Start services:
```bash
docker-compose up -d
```

2. Check API:
```bash
curl http://localhost:8000/api/health
```

3. Access Swagger UI:
```
http://localhost:8000/docs
```

## Rollback

Jika perlu rollback ke Laravel:
1. Gunakan folder `backend/` yang lama
2. Update `docker-compose.yml` untuk menggunakan PHP service
3. Restart services

## Notes

- Database schema sama, jadi data bisa langsung digunakan
- Pastikan MySQL sudah running sebelum start backend
- SNMP OIDs perlu disesuaikan dengan model ZTE yang digunakan

