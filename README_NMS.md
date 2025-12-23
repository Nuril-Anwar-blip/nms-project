# Network Management System (NMS) untuk ZTE OLT

Sistem manajemen jaringan berbasis web untuk monitoring dan provisioning perangkat OLT ZTE (C300 dan C320) menggunakan SNMP, SSH, dan REST API.

## Fitur Utama

### Monitoring
- **Dashboard Real-time**: Ringkasan status OLT dan ONU, jumlah total, status online/offline, alarm aktif
- **Performance Monitoring**: CPU usage, memory, uptime, dan temperatur OLT
- **ONU Monitoring**: Status koneksi, RX/TX power, serial number, port dan PON, histori perubahan status
- **Alarm Management**: Sistem alarm untuk ONU down, LOS, reboot, reset, dan perubahan konfigurasi
- **Activity Logging**: Log semua aktivitas operator untuk audit trail

### Provisioning
- **ONU Provisioning**: Penambahan ONU dengan pemilihan OLT dan PON, input SN ONU, penamaan, service profile
- **PPPoE Account Creation**: Pembuatan akun PPPoE langsung saat provisioning
- **ONU Management**: Hapus, ubah SN, ubah nama, reboot, reset factory default

### Keamanan
- **JWT Authentication**: Autentikasi berbasis token
- **Role-based Access**: Admin dan Operator
- **SSL/TLS Support**: Komunikasi aman
- **Encrypted Credentials**: Kredensial SSH dan API dienkripsi

### Integrasi
- **SNMP v2c dan v3**: Monitoring dan polling perangkat
- **SSH**: Eksekusi perintah untuk provisioning dan management
- **REST API**: Komunikasi dengan endpoint OLT (165.99.239.14:1661)

## Arsitektur Sistem

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTPS
       │
┌──────▼──────────────────┐
│      Nginx              │
│  (Reverse Proxy)        │
└──────┬──────────────────┘
       │
       ├──────────┬──────────┐
       │          │          │
┌──────▼──┐  ┌───▼────┐  ┌──▼─────┐
│ Frontend│  │ Backend│  │ MySQL  │
│ (Vite)  │  │FastAPI │  │        │
└─────────┘  └───┬────┘  └────────┘
                 │
       ┌─────────┼─────────┐
       │         │         │
┌──────▼──┐  ┌───▼────┐  ┌─▼──────┐
│  SNMP   │  │  SSH   │  │ REST   │
│ Service │  │Service │  │ API    │
└────┬────┘  └───┬────┘  └─┬───────┘
     │           │         │
     └───────────┴─────────┘
                 │
          ┌──────▼──────┐
          │ ZTE OLT    │
          │ (C300/C320)│
          └────────────┘
```

## Struktur Database

### Tabel Utama

1. **users**: Pengguna internal (admin/operator)
2. **olts**: Data perangkat OLT (hostname, IP, vendor, model, firmware, SNMP, SSH, API credentials)
3. **pons**: Data PON port
4. **onus**: Data ONU (relasi ke OLT/PON, SN, nama, status, RX/TX power, service profile)
5. **pppoe_accounts**: Akun PPPoE hasil provisioning
6. **alarms**: Event gangguan dan alarm
7. **activity_logs**: Log semua aktivitas operator
8. **locations**: Data lokasi untuk mapping geografis
9. **olt_performance_logs**: Log performa OLT (CPU, memory, temperature)
10. **onu_status_history**: Histori perubahan status ONU

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login dan mendapatkan JWT token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Informasi user saat ini
- `POST /api/auth/register` - Register user baru (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Statistik dashboard
- `GET /api/dashboard/olt-performance` - Performa OLT
- `GET /api/dashboard/recent-alarms` - Alarm terbaru
- `GET /api/dashboard/recent-onus` - ONU terbaru

### Monitoring
- `POST /api/monitoring/olt/{id}/poll` - Poll OLT untuk status dan performa
- `POST /api/monitoring/olt/{id}/sync-onus` - Sync ONU dari OLT ke database
- `GET /api/monitoring/olt/{id}/onus` - Daftar ONU per OLT
- `GET /api/monitoring/onu/{id}/status` - Status detail ONU

### OLT Management
- `GET /api/olts` - Daftar semua OLT
- `POST /api/olts` - Tambah OLT baru
- `GET /api/olts/{id}` - Detail OLT
- `PUT /api/olts/{id}` - Update OLT
- `DELETE /api/olts/{id}` - Hapus OLT
- `GET /api/olts/{id}/status` - Status OLT

### ONU Management
- `GET /api/onus` - Daftar ONU (dengan filter)
- `POST /api/onus` - Tambah ONU
- `GET /api/onus/{id}` - Detail ONU
- `PUT /api/onus/{id}` - Update ONU
- `DELETE /api/onus/{id}` - Hapus ONU

### Provisioning
- `POST /api/provisioning/onu` - Provision ONU baru
- `DELETE /api/provisioning/onu/{id}` - Hapus ONU dari OLT
- `PUT /api/provisioning/onu/{id}/serial` - Update serial number
- `PUT /api/provisioning/onu/{id}/name` - Update nama ONU
- `POST /api/provisioning/onu/{id}/reboot` - Reboot ONU
- `POST /api/provisioning/onu/{id}/reset` - Reset ONU ke factory default
- `POST /api/provisioning/onu/{id}/pppoe` - Buat akun PPPoE

### Alarms
- `GET /api/alarms` - Daftar alarm (dengan filter)
- `GET /api/alarms/{id}` - Detail alarm
- `PUT /api/alarms/{id}/acknowledge` - Acknowledge alarm
- `PUT /api/alarms/{id}/clear` - Clear alarm

### Activity Logs
- `GET /api/activity-logs` - Daftar activity logs (dengan filter)
- `GET /api/activity-logs/stats` - Statistik activity (admin only)

## Contoh Request/Response

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@nms.local",
  "password": "admin123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@nms.local",
    "role": "admin"
  }
}
```

### Provision ONU
```bash
POST /api/provisioning/onu
Authorization: Bearer <token>
Content-Type: application/json

{
  "olt_id": 1,
  "serial_number": "ZTEGC12345678",
  "pon_port": 1,
  "onu_id": 1,
  "name": "Customer-001",
  "model": "F601",
  "pppoe": {
    "username": "customer001",
    "password": "password123",
    "vlan_id": "100",
    "download_speed": 100000000,
    "upload_speed": 50000000
  }
}

Response:
{
  "id": 1,
  "olt_id": 1,
  "serial_number": "ZTEGC12345678",
  "name": "Customer-001",
  "pon_port": 1,
  "onu_id": 1,
  "status": "online",
  "created_at": "2024-01-01T00:00:00"
}
```

### Get Dashboard Stats
```bash
GET /api/dashboard/stats
Authorization: Bearer <token>

Response:
{
  "total_olts": 5,
  "online_olts": 4,
  "offline_olts": 1,
  "total_onus": 150,
  "online_onus": 145,
  "offline_onus": 5,
  "active_alarms": 3,
  "critical_alarms": 1,
  "major_alarms": 2,
  "minor_alarms": 0
}
```

## Instalasi

Lihat [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk panduan instalasi lengkap.

### Quick Start

```bash
# Backend
cd backend_python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## Konfigurasi

### Environment Variables (Backend)

```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/nms
SECRET_KEY=your-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Environment Variables (Frontend)

```env
VITE_API_BASE=http://localhost:8000
```

## Teknologi yang Digunakan

### Backend
- **FastAPI**: Web framework
- **SQLAlchemy**: ORM
- **PySNMP**: SNMP client
- **Paramiko**: SSH client
- **JWT**: Authentication
- **MySQL**: Database

### Frontend
- **React**: UI framework
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **React Router**: Routing

## Struktur Project

```
nms-project/
├── backend_python/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py              # Authentication & JWT
│   │   ├── database.py           # Database connection
│   │   ├── models.py             # Database models
│   │   ├── schemas.py            # Pydantic schemas
│   │   ├── utils.py              # Utility functions
│   │   ├── routers/              # API routes
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── monitoring.py
│   │   │   ├── olts.py
│   │   │   ├── onus.py
│   │   │   ├── provisioning.py
│   │   │   ├── alarms.py
│   │   │   ├── activity_logs.py
│   │   │   └── ...
│   │   └── services/              # Business logic
│   │       ├── snmp_service.py
│   │       ├── ssh_service.py
│   │       ├── rest_api_service.py
│   │       └── olt_service.py
│   ├── main.py                   # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Monitoring.jsx
│   │   │   ├── Provisioning.jsx
│   │   │   ├── OnuManagement.jsx
│   │   │   ├── Alarms.jsx
│   │   │   ├── ActivityLogs.jsx
│   │   │   └── ...
│   │   ├── App.jsx               # Main app
│   │   └── main.jsx
│   └── package.json
├── docker-compose.yml
├── DEPLOYMENT_GUIDE.md
└── README_NMS.md
```

## Pengembangan Lanjutan

Sistem ini dirancang untuk dapat dikembangkan lebih lanjut:
- Modul billing (jika diperlukan)
- Integrasi dengan sistem lain
- Notifikasi real-time (WebSocket)
- Reporting dan analytics
- Multi-tenant support

## Lisensi

Internal use only - Operator/Admin Network Management System

## Support

Untuk pertanyaan dan dukungan, hubungi tim pengembang.

