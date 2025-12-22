# 📚 Index Dokumentasi NMS ZTE OLT

Daftar lengkap semua dokumentasi yang tersedia.

## 📖 Dokumentasi Utama

### 1. **README.md**
   - Overview project
   - Tech stack
   - Quick start guide
   - API endpoints

### 2. **PANDUAN_MODIFIKASI.md**
   - Panduan lengkap modifikasi tampilan
   - Contoh kode untuk setiap komponen
   - Tips & tricks styling
   - Quick reference

### 3. **README_MODIFIKASI.md**
   - Index modifikasi per komponen
   - Lokasi file untuk modifikasi
   - Contoh-contoh praktis
   - Checklist modifikasi

### 4. **CARA_MENGGUNAKAN.md**
   - Panduan penggunaan aplikasi
   - Step-by-step untuk setiap fitur
   - Troubleshooting
   - Quick checklist

### 5. **CLIENT_API_GUIDE.md**
   - Panduan integrasi API client
   - Endpoint yang tersedia
   - Contoh penggunaan
   - Customisasi endpoint

### 6. **CARA_MENAMPILKAN_HASIL.md**
   - Cara menampilkan data dari API client
   - Via frontend
   - Via API langsung
   - Custom display component

### 7. **MIGRATION_GUIDE.md**
   - Panduan migrasi Laravel → Python
   - Perubahan struktur
   - Setup baru
   - Rollback guide

### 8. **QUICK_FIX.md**
   - Fix untuk error umum
   - Docker build issues
   - Dependency problems

---

## 📁 Dokumentasi di Kode

Setiap file komponen memiliki dokumentasi di bagian atas:

### Frontend Components

1. **LandingPage.jsx**
   - Modifikasi hero section
   - Modifikasi features
   - Modifikasi pricing

2. **Login.jsx**
   - Modifikasi form
   - Modifikasi validasi
   - Tambah field baru

3. **Register.jsx**
   - Modifikasi form fields
   - Modifikasi layout grid
   - Modifikasi validasi

4. **Buy.jsx**
   - Modifikasi paket
   - Modifikasi payment methods
   - Modifikasi checkout form

5. **Dashboard.jsx**
   - Modifikasi stat cards
   - Modifikasi refresh interval
   - Tambah stat baru

6. **OltManagement.jsx**
   - Modifikasi table
   - Modifikasi modal
   - Tambah column

7. **OnuManagement.jsx**
   - Modifikasi filter
   - Modifikasi table
   - Modifikasi pagination

8. **Provisioning.jsx**
   - Modifikasi form layout
   - Modifikasi PPPoE section
   - Tambah field baru

9. **Alarms.jsx**
   - Modifikasi severity colors
   - Modifikasi card style
   - Modifikasi refresh interval

10. **Maps.jsx**
    - Modifikasi map size
    - Modifikasi marker colors
    - Ganti dengan library maps

11. **ClientApi.jsx**
    - Modifikasi endpoint cards
    - Modifikasi summary cards
    - Modifikasi table style

### Backend Files

1. **main.py**
   - Modifikasi routing
   - Modifikasi CORS
   - Tambah middleware

2. **models.py**
   - Modifikasi database schema
   - Tambah field baru
   - Modifikasi relationships

3. **routers/*.py**
   - Modifikasi endpoints
   - Tambah endpoint baru
   - Modifikasi response format

4. **services/snmp_service.py**
   - Modifikasi OIDs
   - Modifikasi SNMP operations
   - Tambah method baru

---

## 🎯 Quick Reference

### Modifikasi Warna
- Cari: `bg-blue-600` → Ganti dengan warna lain
- Cari: `text-blue-600` → Ganti dengan warna lain

### Modifikasi Layout
- Grid: `grid-cols-1 md:grid-cols-3`
- Spacing: `p-4`, `mb-6`, `gap-4`

### Modifikasi Typography
- Size: `text-xl`, `text-2xl`, `text-3xl`
- Weight: `font-bold`, `font-semibold`

---

## 🔍 Cara Mencari Dokumentasi

1. **Untuk modifikasi tampilan**: Baca `PANDUAN_MODIFIKASI.md`
2. **Untuk penggunaan**: Baca `CARA_MENGGUNAKAN.md`
3. **Untuk API client**: Baca `CLIENT_API_GUIDE.md`
4. **Untuk error fix**: Baca `QUICK_FIX.md`
5. **Di dalam kode**: Lihat komentar `MODIFIKASI` di setiap file

---

## 📞 Support

Jika tidak menemukan dokumentasi yang dicari:
1. Check komentar di file komponen
2. Lihat contoh di komponen yang mirip
3. Referensi Tailwind CSS docs
4. Check React Router docs untuk routing

---

## ✅ Checklist Dokumentasi

- [x] Landing Page
- [x] Login Page
- [x] Register Page
- [x] Buy/Purchase Page
- [x] Dashboard
- [x] OLT Management
- [x] ONU Management
- [x] Provisioning
- [x] Alarms
- [x] Maps
- [x] Client API
- [x] Backend Services
- [x] API Routes

