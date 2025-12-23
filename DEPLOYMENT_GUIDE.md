# Panduan Deployment NMS ZTE OLT

## Daftar Isi
1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi Backend](#instalasi-backend)
3. [Instalasi Frontend](#instalasi-frontend)
4. [Konfigurasi Database](#konfigurasi-database)
5. [Konfigurasi SSL/TLS](#konfigurasi-ssltls)
6. [Deployment dengan Docker](#deployment-dengan-docker)
7. [Konfigurasi Nginx](#konfigurasi-nginx)
8. [Setup Awal](#setup-awal)
9. [Troubleshooting](#troubleshooting)

## Persyaratan Sistem

### Server Requirements
- **OS**: Ubuntu 20.04 LTS atau lebih baru / Debian 11 atau lebih baru
- **RAM**: Minimum 2GB, disarankan 4GB+
- **Storage**: Minimum 20GB
- **CPU**: 2 cores atau lebih
- **Network**: Akses ke perangkat OLT ZTE (SNMP, SSH, REST API)

### Software Requirements
- Python 3.9+
- Node.js 18+
- MySQL 8.0+
- Nginx (untuk reverse proxy)
- Certbot (untuk SSL)

## Instalasi Backend

### 1. Persiapan Environment

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Python dan dependencies
sudo apt install -y python3 python3-pip python3-venv mysql-server nginx

# Install Node.js (jika belum ada)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Setup Database MySQL

```bash
# Login ke MySQL
sudo mysql -u root

# Buat database dan user
CREATE DATABASE nms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON nms.* TO 'nms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Setup Backend

```bash
# Clone atau upload project ke server
cd /opt
sudo mkdir -p nms-project
cd nms-project

# Upload backend files ke backend_python/
cd backend_python

# Buat virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Buat file .env
cat > .env << EOF
DATABASE_URL=mysql+pymysql://nms_user:your_secure_password@localhost:3306/nms
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
ENCRYPTION_KEY=$(python3 -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())')
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
EOF

# Jalankan migrasi database (jika menggunakan Alembic)
# alembic upgrade head

# Atau buat tabel secara langsung
python3 -c "from app.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine)"
```

### 4. Buat User Admin Awal

```bash
# Masuk ke Python shell
python3 << EOF
from app.database import SessionLocal
from app.models import User, UserRole
from app.auth import get_password_hash

db = SessionLocal()
admin = User(
    name="Admin",
    email="admin@nms.local",
    password=get_password_hash("admin123"),
    role=UserRole.ADMIN,
    is_active=True
)
db.add(admin)
db.commit()
print("Admin user created: admin@nms.local / admin123")
db.close()
EOF
```

### 5. Setup Systemd Service

```bash
sudo cat > /etc/systemd/system/nms-backend.service << EOF
[Unit]
Description=NMS ZTE OLT Backend API
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/nms-project/backend_python
Environment="PATH=/opt/nms-project/backend_python/venv/bin"
ExecStart=/opt/nms-project/backend_python/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable dan start service
sudo systemctl daemon-reload
sudo systemctl enable nms-backend
sudo systemctl start nms-backend
sudo systemctl status nms-backend
```

## Instalasi Frontend

### 1. Setup Frontend

```bash
cd /opt/nms-project/frontend

# Install dependencies
npm install

# Buat file .env
cat > .env << EOF
VITE_API_BASE=http://localhost:8000
EOF

# Build production
npm run build
```

### 2. Setup Nginx untuk Frontend

```bash
sudo cat > /etc/nginx/sites-available/nms-frontend << EOF
server {
    listen 80;
    server_name your-domain.com;

    root /opt/nms-project/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/nms-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Konfigurasi SSL/TLS

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal sudah diaktifkan otomatis
```

## Deployment dengan Docker

Alternatif menggunakan Docker Compose:

```bash
cd /opt/nms-project

# Edit docker-compose.yml sesuai kebutuhan
# Pastikan environment variables sudah benar

# Build dan start
docker-compose up -d

# Check logs
docker-compose logs -f
```

## Setup Awal

### 1. Akses Aplikasi

- Frontend: `https://your-domain.com`
- Backend API: `https://your-domain.com/api`
- Login default: `admin@nms.local` / `admin123`

### 2. Tambah OLT Pertama

1. Login ke dashboard
2. Navigasi ke menu "OLTs"
3. Klik "Add OLT"
4. Isi informasi OLT:
   - Name: Nama OLT
   - IP Address: IP OLT (contoh: 165.99.239.14)
   - Model: C300 atau C320
   - SNMP Community: Community string (default: public)
   - SNMP Version: 2 atau 3
   - SSH Username/Password: Kredensial SSH
   - API Endpoint: http://165.99.239.14:1661 (jika menggunakan REST API)

### 3. Test Koneksi

1. Pilih OLT yang baru ditambahkan
2. Klik "Poll OLT" untuk test koneksi SNMP
3. Klik "Sync ONUs" untuk mengambil daftar ONU dari OLT

## Troubleshooting

### Backend tidak start

```bash
# Check logs
sudo journalctl -u nms-backend -f

# Check port
sudo netstat -tlnp | grep 8000
```

### Database connection error

```bash
# Test koneksi MySQL
mysql -u nms_user -p nms

# Check .env file
cat /opt/nms-project/backend_python/.env
```

### Frontend tidak load

```bash
# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check file permissions
sudo chown -R www-data:www-data /opt/nms-project/frontend/dist
```

### SNMP tidak bekerja

- Pastikan firewall mengizinkan port 161 (SNMP)
- Test SNMP dari server: `snmpwalk -v2c -c public <OLT_IP> 1.3.6.1.2.1.1.1.0`
- Periksa SNMP community string di konfigurasi OLT

### SSH connection error

- Pastikan SSH port (22) terbuka
- Test SSH manual: `ssh username@olt_ip`
- Periksa kredensial SSH di database

## Security Best Practices

1. **Ubah password default** setelah setup pertama
2. **Gunakan SSL/TLS** untuk semua komunikasi
3. **Restrict database access** hanya dari localhost
4. **Setup firewall** untuk membatasi akses
5. **Regular backups** database
6. **Update sistem** secara berkala
7. **Monitor logs** untuk aktivitas mencurigakan

## Backup dan Restore

### Backup Database

```bash
mysqldump -u nms_user -p nms > nms_backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
mysql -u nms_user -p nms < nms_backup_YYYYMMDD.sql
```

## Monitoring dan Maintenance

- Setup monitoring untuk service status
- Monitor disk space dan database size
- Regular backup database
- Review activity logs secara berkala
- Update dependencies secara berkala

