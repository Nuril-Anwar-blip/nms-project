# NMS ZTE OLT - Python Backend

FastAPI backend untuk Network Management System ZTE OLT.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Setup environment:
```bash
cp .env.example .env
# Edit .env dengan konfigurasi database
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Run development server:
```bash
uvicorn main:app --reload
```

## API Documentation

Setelah server running, akses:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Structure

```
backend_python/
├── app/
│   ├── __init__.py
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── routers/             # API routes
│   │   ├── olts.py
│   │   ├── onus.py
│   │   ├── alarms.py
│   │   ├── provisioning.py
│   │   ├── locations.py
│   │   └── maps.py
│   ├── services/            # Business logic
│   │   └── snmp_service.py
│   └── tasks/                # Background tasks
│       └── poller.py
├── alembic/                  # Database migrations
├── main.py                   # FastAPI app
├── requirements.txt
└── Dockerfile
```

## Features

- ✅ RESTful API dengan FastAPI
- ✅ SNMP integration untuk ZTE OLT
- ✅ ONU provisioning
- ✅ Real-time monitoring
- ✅ Alarm management
- ✅ Maps visualization
- ✅ Database migrations dengan Alembic

