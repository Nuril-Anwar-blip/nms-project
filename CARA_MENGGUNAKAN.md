# 🚀 Cara Menggunakan NMS ZTE OLT

Panduan lengkap untuk menggunakan aplikasi NMS ZTE OLT.

## 📋 Daftar Isi

1. [Setup Awal](#setup-awal)
2. [Halaman Utama (Landing Page)](#halaman-utama)
3. [Register & Login](#register--login)
4. [Dashboard](#dashboard)
5. [Fitur Utama](#fitur-utama)
6. [Client API Integration](#client-api-integration)

---

## 🛠️ Setup Awal

### 1. Install Dependencies

```bash
# Backend
cd backend_python
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 2. Setup Database

```bash
# Masuk ke container backend
docker exec -it nms_backend bash

# Run migrations
alembic upgrade head
```

### 3. Start Services

```bash
# Start semua services
docker-compose up -d

# Atau start manual
# Backend
cd backend_python
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

---

## 🏠 Halaman Utama (Landing Page)

**URL**: http://localhost:5173/

### Fitur:
- ✅ Hero section dengan CTA
- ✅ Features showcase
- ✅ Pricing plans
- ✅ Footer dengan links

### Cara Menggunakan:
1. Buka browser: http://localhost:5173/
2. Scroll untuk melihat features
3. Klik "Daftar Sekarang" untuk register
4. Klik "Lihat Paket" untuk melihat pricing

---

## 📝 Register & Login

### Register

**URL**: http://localhost:5173/register

**Langkah:**
1. Klik "Daftar Sekarang" di landing page
2. Isi form:
   - Nama Lengkap
   - Email
   - Password (min 6 karakter)
   - Konfirmasi Password
   - Nama Perusahaan (opsional)
   - Nomor Telepon (opsional)
3. Centang "Syarat & Ketentuan"
4. Klik "Daftar Sekarang"
5. Akan redirect ke login

### Login

**URL**: http://localhost:5173/login

**Langkah:**
1. Masukkan email dan password
2. (Opsional) Centang "Ingat saya"
3. Klik "Masuk"
4. Akan redirect ke dashboard

**Note**: Untuk demo, login dengan email/password apapun akan berhasil.

---

## 💰 Halaman Beli (Buy/Purchase)

**URL**: http://localhost:5173/buy

### Langkah:

1. **Pilih Paket**
   - Starter (Gratis)
   - Professional (Rp 500K/bulan) - Populer
   - Enterprise (Custom)

2. **Klik "Pilih Paket"** pada paket yang diinginkan

3. **Isi Form Checkout**
   - Nama Lengkap
   - Email
   - Nomor Telepon
   - Nama Perusahaan
   - Alamat

4. **Pilih Metode Pembayaran**
   - Bank Transfer
   - Credit Card
   - E-Wallet
   - Cryptocurrency

5. **Review Order Summary**
   - Pastikan paket dan harga benar

6. **Klik "Lanjutkan Pembayaran"**
   - Akan muncul konfirmasi
   - Redirect ke dashboard

---

## 📊 Dashboard

**URL**: http://localhost:5173/dashboard

### Fitur Dashboard:

1. **Stat Cards**
   - Total OLTs (Online/Offline)
   - Total ONUs (Online/Offline)
   - Active Alarms (Critical/Major)

2. **Recent Alarms**
   - Daftar 10 alarm terbaru
   - Auto refresh setiap 30 detik

### Navigasi:

Klik tab di header untuk navigasi:
- 📊 Dashboard
- 🔌 OLTs
- 📡 ONUs
- ⚙️ Provisioning
- 🚨 Alarms
- 🗺️ Maps
- 🔗 Client API

---

## 🔌 OLT Management

**URL**: http://localhost:5173/dashboard/olts

### Fitur:
- ✅ List semua OLT
- ✅ Tambah OLT baru
- ✅ Edit OLT
- ✅ Hapus OLT
- ✅ Filter by status

### Cara Menggunakan:

**Tambah OLT:**
1. Klik "+ Add OLT"
2. Isi form:
   - Name
   - IP Address
   - Model (opsional)
   - SNMP Community
   - SNMP Version
   - Location (opsional)
3. Klik "Save"

**Edit OLT:**
1. Klik "Edit" pada OLT yang ingin diubah
2. Ubah data
3. Klik "Save"

**Hapus OLT:**
1. Klik "Delete" pada OLT
2. Konfirmasi penghapusan

---

## 📡 ONU Management

**URL**: http://localhost:5173/dashboard/onus

### Fitur:
- ✅ List semua ONU
- ✅ Filter by OLT
- ✅ Filter by Status
- ✅ Lihat detail ONU

### Cara Menggunakan:

**Filter ONU:**
1. Pilih OLT dari dropdown "All OLTs"
2. Pilih Status dari dropdown "All Status"
3. Tabel akan otomatis update

---

## ⚙️ Provisioning

**URL**: http://localhost:5173/dashboard/provisioning

### Fitur:
- ✅ Provision ONU baru
- ✅ Buat PPPoE account saat provisioning
- ✅ Konfigurasi lengkap

### Cara Menggunakan:

1. **Pilih OLT** dari dropdown
2. **Isi Data ONU:**
   - Serial Number
   - PON Port
   - ONU ID
   - Name (opsional)

3. **PPPoE (Opsional):**
   - Centang "Create PPPoE Account"
   - Isi Username
   - Isi Password
   - Isi VLAN ID (opsional)

4. **Klik "Provision ONU"**
   - ONU akan di-provision di OLT
   - PPPoE akan dibuat jika dicentang

---

## 🚨 Alarms

**URL**: http://localhost:5173/dashboard/alarms

### Fitur:
- ✅ List semua alarms
- ✅ Filter by status
- ✅ Filter by severity
- ✅ Acknowledge alarm
- ✅ Clear alarm
- ✅ Auto refresh setiap 30 detik

### Cara Menggunakan:

**Filter Alarms:**
1. Pilih Status: Active, Cleared, atau Acknowledged
2. Pilih Severity: Critical, Major, Minor, Warning, Info
3. Tabel akan update otomatis

**Acknowledge Alarm:**
1. Klik "Acknowledge" pada alarm aktif
2. Alarm akan di-mark sebagai acknowledged

**Clear Alarm:**
1. Klik "Clear" pada alarm aktif
2. Alarm akan di-mark sebagai cleared

---

## 🗺️ Maps

**URL**: http://localhost:5173/dashboard/maps

### Fitur:
- ✅ Visualisasi OLT di peta
- ✅ Visualisasi ONU di peta
- ✅ Toggle show/hide ONU
- ✅ Info cards untuk setiap OLT

### Cara Menggunakan:

1. **Lihat Peta**
   - OLT ditampilkan sebagai marker biru
   - ONU ditampilkan sebagai marker hijau (jika enabled)

2. **Toggle ONU**
   - Centang/uncentang "Show ONUs"
   - ONU akan muncul/hilang di peta

3. **Lihat Info**
   - Scroll ke bawah untuk melihat info cards
   - Setiap card menampilkan detail OLT

**Note**: Pastikan OLT dan ONU memiliki koordinat (latitude/longitude) untuk ditampilkan di peta.

---

## 🔗 Client API Integration

**URL**: http://localhost:5173/dashboard/client-api

### Fitur:
- ✅ Test connection ke API client
- ✅ Get health status
- ✅ Get all data
- ✅ Get devices
- ✅ Get status
- ✅ Get metrics
- ✅ Custom endpoint

### Cara Menggunakan:

1. **Pilih Endpoint**
   - Klik salah satu endpoint card:
     - Health Check
     - All Data
     - Devices
     - Status
     - Metrics
     - Test Connection

2. **Custom Endpoint**
   - Klik "Custom"
   - Masukkan path endpoint (contoh: `/api/custom/data`)
   - Klik "Fetch"

3. **Lihat Hasil**
   - Data akan muncul di bawah
   - Summary statistics akan ditampilkan
   - Tabel devices akan muncul jika ada
   - JSON viewer untuk raw data

4. **Refresh Data**
   - Klik "Refresh Data" untuk update
   - Data akan auto-refresh saat pilih endpoint baru

---

## 🔐 Authentication

### Protected Routes

Semua route `/dashboard/*` memerlukan authentication:
- Jika belum login, akan redirect ke `/login`
- Token disimpan di `localStorage`

### Logout

1. Klik "Logout" di header dashboard
2. Token akan dihapus
3. Redirect ke login page

---

## 📱 Responsive Design

Aplikasi responsive untuk:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

---

## 🆘 Troubleshooting

### Data Tidak Muncul?

1. Check API backend running: http://localhost:8000
2. Check browser console (F12) untuk error
3. Check network tab untuk request/response

### Login Tidak Berfungsi?

1. Check localStorage untuk token
2. Clear browser cache
3. Check API endpoint di browser console

### Client API Error?

1. Pastikan API client di `165.99.239.14:1661` bisa diakses
2. Check firewall rules
3. Test dengan curl: `curl http://165.99.239.14:1661/health`

---

## 📚 Dokumentasi Lengkap

- **Modifikasi Tampilan**: Lihat `PANDUAN_MODIFIKASI.md`
- **Client API**: Lihat `CLIENT_API_GUIDE.md`
- **Migration**: Lihat `MIGRATION_GUIDE.md`

---

## ✅ Quick Checklist

- [ ] Backend running (http://localhost:8000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Database migrated
- [ ] Bisa akses landing page
- [ ] Bisa register & login
- [ ] Bisa akses dashboard
- [ ] Client API bisa diakses

---

## 🎯 Next Steps

1. Tambah OLT pertama
2. Test SNMP connection
3. Provision ONU pertama
4. Setup monitoring
5. Integrate dengan API client

