# Panduan Penggunaan Client API Integration

## Overview

Sistem NMS telah diintegrasikan dengan API Client di `165.99.239.14:1661` untuk menampilkan data dari sistem client.

## Konfigurasi

### Backend (Python FastAPI)

API Client service sudah dikonfigurasi di:
- **Service**: `backend_python/app/services/client_api_service.py`
- **Router**: `backend_python/app/routers/client_api.py`
- **Base URL**: `http://165.99.239.14:1661`

### Frontend (React)

Component untuk menampilkan data client API:
- **Component**: `frontend/src/components/ClientApi.jsx`
- **Tab**: "Client API" di menu utama

## Endpoint yang Tersedia

### 1. Health Check
```
GET /api/client/health
```
Cek status koneksi ke API client.

### 2. Get All Data
```
GET /api/client/data
```
Mengambil semua data dari API client.

### 3. Get Devices
```
GET /api/client/devices
```
Mengambil daftar devices dari API client.

### 4. Get Device by ID
```
GET /api/client/devices/{device_id}
```
Mengambil device spesifik berdasarkan ID.

### 5. Get Status
```
GET /api/client/status
```
Mengambil status dari API client.

### 6. Get Metrics
```
GET /api/client/metrics
```
Mengambil metrics dari API client.

### 7. Custom Endpoint
```
GET /api/client/custom?endpoint=/api/custom/path
```
Mengakses custom endpoint dari API client.

### 8. Test Connection
```
GET /api/client/test
```
Test koneksi lengkap ke API client.

## Cara Menggunakan

### Via Frontend (Recommended)

1. **Buka aplikasi NMS**
   - Akses: http://localhost:5173
   - Login jika diperlukan

2. **Klik tab "Client API"**
   - Tab ini akan menampilkan interface untuk mengakses API client

3. **Pilih Endpoint**
   - Klik salah satu endpoint button:
     - Health Check
     - All Data
     - Devices
     - Status
     - Metrics
     - Test Connection

4. **Custom Endpoint**
   - Pilih "Custom" untuk mengakses endpoint khusus
   - Masukkan path endpoint (contoh: `/api/custom/data`)
   - Klik "Fetch"

5. **Lihat Hasil**
   - Data akan ditampilkan dalam format JSON
   - Summary statistics akan ditampilkan jika tersedia
   - Tabel devices akan ditampilkan jika data berupa array devices

### Via API Direct

#### Menggunakan cURL

```bash
# Health Check
curl http://localhost:8000/api/client/health

# Get All Data
curl http://localhost:8000/api/client/data

# Get Devices
curl http://localhost:8000/api/client/devices

# Get Status
curl http://localhost:8000/api/client/status

# Custom Endpoint
curl "http://localhost:8000/api/client/custom?endpoint=/api/custom/data"
```

#### Menggunakan Python

```python
import requests

# Base URL
base_url = "http://localhost:8000/api/client"

# Get devices
response = requests.get(f"{base_url}/devices")
devices = response.json()
print(devices)

# Get status
response = requests.get(f"{base_url}/status")
status = response.json()
print(status)
```

#### Menggunakan JavaScript/Fetch

```javascript
// Get devices
fetch('http://localhost:8000/api/client/devices')
  .then(response => response.json())
  .then(data => console.log(data));

// Get status
fetch('http://localhost:8000/api/client/status')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Response Format

Semua response mengikuti format berikut:

```json
{
  "success": true,
  "data": {...},
  "count": 10,
  "source": "165.99.239.14:1661"
}
```

### Contoh Response Devices

```json
{
  "success": true,
  "count": 5,
  "devices": [
    {
      "id": "device1",
      "name": "Device 1",
      "status": "online",
      "ip": "192.168.1.10"
    }
  ],
  "source": "165.99.239.14:1661"
}
```

## Customisasi Endpoint

Jika API client menggunakan endpoint yang berbeda, edit file:

`backend_python/app/services/client_api_service.py`

Contoh:
```python
def get_devices(self) -> List[Dict]:
    """Get devices from client API"""
    # Ganti endpoint sesuai API client
    data = self._make_request("/api/v1/devices")  # Custom endpoint
    if data:
        return data if isinstance(data, list) else [data]
    return []
```

## Error Handling

Sistem akan menangani error dengan baik:

1. **Connection Error**: Jika tidak bisa connect ke API client
2. **Timeout**: Jika request timeout (default: 10 detik)
3. **HTTP Error**: Jika API client return error status
4. **Invalid Response**: Jika response tidak valid

Error akan ditampilkan di frontend dengan pesan yang jelas.

## Testing

### Test Koneksi

```bash
# Via API
curl http://localhost:8000/api/client/test

# Response akan menunjukkan:
# - Connection status
# - Health check result
# - Devices count
# - Status information
```

### Test dari Frontend

1. Buka tab "Client API"
2. Klik "Test Connection"
3. Lihat hasil di response area

## Troubleshooting

### 1. API Client Tidak Bisa Diakses

**Problem**: Connection error atau timeout

**Solution**:
- Pastikan API client di `165.99.239.14:1661` bisa diakses dari server
- Check firewall rules
- Verify network connectivity

### 2. Endpoint Tidak Ditemukan

**Problem**: 404 Not Found

**Solution**:
- Pastikan endpoint path benar
- Check dokumentasi API client
- Gunakan custom endpoint untuk test

### 3. Response Format Berbeda

**Problem**: Data tidak tampil dengan benar

**Solution**:
- Check response format dari API client
- Adjust parsing di `client_api_service.py`
- Update frontend component jika perlu

## Best Practices

1. **Caching**: Pertimbangkan implementasi caching untuk mengurangi request
2. **Error Retry**: Implement retry mechanism untuk request yang gagal
3. **Rate Limiting**: Jangan terlalu sering request ke API client
4. **Monitoring**: Monitor health check secara berkala
5. **Logging**: Enable logging untuk debugging

## Contoh Integrasi

### Menampilkan Data di Dashboard

Edit `frontend/src/components/Dashboard.jsx`:

```javascript
const [clientData, setClientData] = useState(null)

useEffect(() => {
  fetch(`${apiBase}/client/devices`)
    .then(res => res.json())
    .then(data => setClientData(data))
}, [])
```

### Auto Refresh Data

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData()
  }, 30000) // Refresh setiap 30 detik
  
  return () => clearInterval(interval)
}, [])
```

## Support

Jika ada masalah atau pertanyaan:
1. Check logs di backend
2. Test koneksi langsung ke API client
3. Verify endpoint dan credentials
4. Check network connectivity

