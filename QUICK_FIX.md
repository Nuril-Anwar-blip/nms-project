# Quick Fix: Docker Build Error

## Masalah
Error saat build Docker: `pysnmp==5.0.5` tidak tersedia

## Solusi
Versi `pysnmp` sudah diupdate dari `5.0.5` ke `7.1.22` di `requirements.txt`

## Langkah Build Ulang

1. **Rebuild Docker image:**
```bash
docker-compose build --no-cache backend
```

2. **Atau rebuild semua:**
```bash
docker-compose build --no-cache
```

3. **Start services:**
```bash
docker-compose up -d
```

## Jika Masih Error

Jika masih ada masalah dengan pysnmp 7.x, gunakan versi yang lebih stabil:

Edit `backend_python/requirements.txt`:
```txt
pysnmp==6.2.6
```

Atau versi 5.1.0:
```txt
pysnmp==5.1.0
```

## Verifikasi

Setelah build berhasil, cek logs:
```bash
docker-compose logs backend
```

## Catatan

- pysnmp 7.x backward compatible dengan 5.x untuk penggunaan dasar
- API yang digunakan (getCmd, setCmd, nextCmd) tetap sama
- Tidak perlu perubahan kode

