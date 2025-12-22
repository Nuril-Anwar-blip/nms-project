# Cara Menampilkan Hasil dari API Client

## 🎯 Cara Cepat (Via Frontend)

### Langkah 1: Start Aplikasi
```bash
# Start semua services
docker-compose up -d

# Atau jika belum build
docker-compose build
docker-compose up -d
```

### Langkah 2: Buka Browser
1. Buka: **http://localhost:5173**
2. Aplikasi NMS akan terbuka

### Langkah 3: Akses Tab Client API
1. Di menu atas, klik tab **"Client API"** (ikon 🔗)
2. Halaman Client API akan muncul

### Langkah 4: Pilih Endpoint
Klik salah satu tombol endpoint:
- **Health Check** - Cek status API
- **All Data** - Tampilkan semua data
- **Devices** - Tampilkan daftar devices
- **Status** - Tampilkan status
- **Metrics** - Tampilkan metrics
- **Test Connection** - Test koneksi lengkap

### Langkah 5: Lihat Hasil
- Data akan muncul di area **"Response Data"**
- Format JSON yang rapi
- Jika ada devices, akan muncul tabel otomatis
- Summary statistics di bagian bawah

---

## 📋 Contoh Tampilan

### 1. Health Check
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### 2. Devices
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

### 3. Status
```json
{
  "success": true,
  "status": {
    "uptime": "2 days",
    "connected_devices": 10,
    "total_requests": 1500
  },
  "source": "165.99.239.14:1661"
}
```

---

## 🔧 Custom Endpoint

Jika API client menggunakan endpoint khusus:

1. Klik tombol **"Custom"**
2. Masukkan path endpoint (contoh: `/api/v1/data`)
3. Klik **"Fetch"**
4. Hasil akan muncul

**Contoh Custom Endpoint:**
- `/api/v1/devices`
- `/api/custom/data`
- `/api/status/all`

---

## 💻 Via API Langsung (cURL/Postman)

### Test Connection
```bash
curl http://localhost:8000/api/client/test
```

### Get All Data
```bash
curl http://localhost:8000/api/client/data
```

### Get Devices
```bash
curl http://localhost:8000/api/client/devices
```

### Get Status
```bash
curl http://localhost:8000/api/client/status
```

### Custom Endpoint
```bash
curl "http://localhost:8000/api/client/custom?endpoint=/api/custom/data"
```

---

## 🌐 Via Browser (Swagger UI)

1. Buka: **http://localhost:8000/docs**
2. Cari section **"Client API"**
3. Klik endpoint yang diinginkan
4. Klik **"Try it out"**
5. Klik **"Execute"**
6. Lihat hasil di **"Response"**

---

## 📊 Menampilkan di Dashboard

Jika ingin menampilkan data client API di Dashboard:

### Edit `frontend/src/components/Dashboard.jsx`

```javascript
import { useState, useEffect } from 'react'

export default function Dashboard({ apiBase }) {
  const [clientData, setClientData] = useState(null)

  useEffect(() => {
    // Fetch data dari client API
    fetch(`${apiBase}/client/devices`)
      .then(res => res.json())
      .then(data => {
        setClientData(data)
      })
      .catch(err => console.error('Error:', err))
  }, [apiBase])

  return (
    <div>
      <h2>Dashboard</h2>
      
      {/* Tampilkan data client API */}
      {clientData && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Client API Devices</h3>
          <p>Total Devices: {clientData.count || 0}</p>
          
          {clientData.devices && (
            <div className="mt-4">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clientData.devices.map((device, idx) => (
                    <tr key={idx}>
                      <td>{device.id}</td>
                      <td>{device.name}</td>
                      <td>{device.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* ... rest of dashboard ... */}
    </div>
  )
}
```

---

## 🔄 Auto Refresh (Real-time)

Untuk auto refresh setiap 30 detik:

```javascript
useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(`${apiBase}/client/devices`)
    const data = await res.json()
    setClientData(data)
  }

  // Fetch immediately
  fetchData()

  // Then every 30 seconds
  const interval = setInterval(fetchData, 30000)

  return () => clearInterval(interval)
}, [apiBase])
```

---

## 🎨 Custom Display Component

Buat component khusus untuk menampilkan data:

### `frontend/src/components/ClientDataDisplay.jsx`

```javascript
import { useState, useEffect } from 'react'

export default function ClientDataDisplay({ apiBase, endpoint = 'devices' }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${apiBase}/client/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [apiBase, endpoint])

  if (loading) return <div>Loading...</div>
  if (!data) return <div>No data</div>

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Client API Data</h3>
      
      {/* Display based on data type */}
      {data.devices && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Total: {data.count || data.devices.length}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.devices.map((device, idx) => (
              <div key={idx} className="border rounded p-4">
                <h4 className="font-semibold">{device.name || device.id}</h4>
                <p className="text-sm text-gray-600">Status: {device.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.status && (
        <div>
          <pre className="bg-gray-50 p-4 rounded">
            {JSON.stringify(data.status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
```

**Gunakan di halaman lain:**
```javascript
import ClientDataDisplay from './components/ClientDataDisplay'

// Di component
<ClientDataDisplay apiBase={API_BASE} endpoint="devices" />
```

---

## 🐛 Troubleshooting

### Data Tidak Muncul?

1. **Cek Koneksi API Client**
   ```bash
   curl http://165.99.239.14:1661/health
   ```

2. **Cek Backend Logs**
   ```bash
   docker-compose logs backend
   ```

3. **Cek Browser Console**
   - Buka Developer Tools (F12)
   - Lihat tab Console untuk error

4. **Test Endpoint Langsung**
   ```bash
   curl http://localhost:8000/api/client/test
   ```

### Error "Cannot connect"?

1. Pastikan API client di `165.99.239.14:1661` bisa diakses
2. Check firewall rules
3. Verify network connectivity dari server

### Data Format Berbeda?

Edit `backend_python/app/services/client_api_service.py` untuk adjust parsing sesuai format API client.

---

## 📝 Tips

1. **Gunakan Swagger UI** untuk test endpoint dengan mudah
2. **Check Network Tab** di browser untuk melihat request/response
3. **Gunakan Postman** untuk test API lebih detail
4. **Enable CORS** jika perlu akses dari domain lain
5. **Add Error Handling** di frontend untuk user experience yang lebih baik

---

## 🚀 Quick Start Checklist

- [ ] Docker services running (`docker-compose up -d`)
- [ ] Frontend accessible (http://localhost:5173)
- [ ] Backend API accessible (http://localhost:8000)
- [ ] API client accessible (165.99.239.14:1661)
- [ ] Tab "Client API" muncul di menu
- [ ] Bisa klik endpoint dan lihat hasil

---

## 📞 Support

Jika masih ada masalah:
1. Check logs: `docker-compose logs backend`
2. Test API langsung: `curl http://localhost:8000/api/client/test`
3. Verify API client: `curl http://165.99.239.14:1661/health`

