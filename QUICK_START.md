# Quick Start Guide - Menjalankan Aplikasi NMS

## Prerequisites

1. **Python 3.9+** - Untuk backend
2. **Node.js 18+** - Untuk frontend
3. **MySQL 8.0+** - Database server

## Setup Database

1. Buat database MySQL:
```sql
CREATE DATABASE nms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nms_user'@'localhost' IDENTIFIED BY 'nms_pass';
GRANT ALL PRIVILEGES ON nms.* TO 'nms_user'@'localhost';
FLUSH PRIVILEGES;
```

## Setup Backend

1. Masuk ke folder backend:
```bash
cd backend_python
```

2. Buat virtual environment:
```bash
python -m venv venv
```

3. Aktifkan virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Buat file .env:
```bash
# Copy dari .env.example
copy .env.example .env  # Windows
# atau
cp .env.example .env    # Linux/Mac
```

6. Edit file .env dan sesuaikan DATABASE_URL:
```
DATABASE_URL=mysql+pymysql://nms_user:nms_pass@localhost:3306/nms
```

7. Generate SECRET_KEY dan ENCRYPTION_KEY:
```python
# SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# ENCRYPTION_KEY
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

8. Jalankan backend:
```bash
python run.py
# atau
uvicorn main:app --reload
```

Backend akan berjalan di: http://localhost:8000

## Setup Frontend

1. Masuk ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Buat file .env (opsional):
```env
VITE_API_BASE=http://localhost:8000
```

4. Jalankan frontend:
```bash
npm run dev
```

Frontend akan berjalan di: http://localhost:5173

## Setup User Admin Pertama

Setelah backend berjalan, buat user admin pertama:

```python
python
```

```python
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
```

## Akses Aplikasi

1. Buka browser: http://localhost:5173
2. Login dengan:
   - Email: admin@nms.local
   - Password: admin123

## Troubleshooting

### Backend tidak bisa connect ke database
- Pastikan MySQL sudah running
- Cek kredensial di file .env
- Pastikan database sudah dibuat

### Frontend tidak bisa connect ke backend
- Pastikan backend sudah running di port 8000
- Cek VITE_API_BASE di .env frontend
- Cek CORS settings di main.py

### Import error di Python
- Pastikan virtual environment sudah diaktifkan
- Install ulang dependencies: pip install -r requirements.txt

### TypeScript error di frontend
- Install dependencies: npm install
- Pastikan TypeScript sudah terinstall: npm list typescript

