# 📖 Panduan Lengkap Modifikasi Tampilan NMS ZTE OLT

Dokumentasi lengkap untuk memodifikasi semua komponen tampilan.

## 🎯 Quick Start

1. **Buka file komponen** yang ingin dimodifikasi
2. **Cari komentar `MODIFIKASI`** di dalam file
3. **Edit sesuai kebutuhan**
4. **Save dan lihat hasilnya**

---

## 📁 Struktur File & Lokasi Modifikasi

### 1. Landing Page
**File**: `frontend/src/components/LandingPage.jsx`

**Yang bisa dimodifikasi:**
- ✅ Hero section (judul, subtitle, CTA buttons)
- ✅ Features section (tambah/kurangi features)
- ✅ Pricing section (ubah paket dan harga)
- ✅ Footer (ubah link dan konten)
- ✅ Warna gradient background
- ✅ Logo/icon

**Contoh modifikasi:**
```jsx
// Ubah judul hero (baris ~40)
<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
  Judul Baru Anda
  <span className="block text-blue-600 mt-2">Subtitle Baru</span>
</h1>

// Ubah warna background (baris ~30)
<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
```

---

### 2. Login Page
**File**: `frontend/src/components/Login.jsx`

**Yang bisa dimodifikasi:**
- ✅ Background gradient
- ✅ Form card style
- ✅ Input field style
- ✅ Button color
- ✅ Logo/icon
- ✅ Tambah field baru (remember me, captcha, dll)

**Contoh modifikasi:**
```jsx
// Ubah warna background (baris ~30)
<div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">

// Ubah warna button (baris ~120)
className="... bg-gradient-to-r from-green-600 to-emerald-600 ..."

// Tambah field baru (setelah baris ~70)
<div>
  <label>New Field</label>
  <input type="text" name="newField" />
</div>
```

---

### 3. Register Page
**File**: `frontend/src/components/Register.jsx`

**Yang bisa dimodifikasi:**
- ✅ Grid layout (2 kolom, 3 kolom, dll)
- ✅ Form fields (tambah/kurangi)
- ✅ Validasi password
- ✅ Terms & conditions checkbox
- ✅ Social login buttons

**Contoh modifikasi:**
```jsx
// Ubah grid menjadi 3 kolom (baris ~50)
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

// Ubah validasi password (baris ~30)
if (formData.password.length < 8) {  // dari 6 menjadi 8
  setError('Password minimal 8 karakter')
  return
}
```

---

### 4. Buy/Purchase Page
**File**: `frontend/src/components/Buy.jsx`

**Yang bisa dimodifikasi:**
- ✅ Paket pricing (tambah/kurangi paket)
- ✅ Harga paket
- ✅ Fitur paket
- ✅ Payment methods
- ✅ Checkout form fields
- ✅ Order summary style

**Contoh modifikasi:**
```jsx
// Tambah paket baru (baris ~20)
const packages = [
  // ... existing packages
  {
    id: 'premium',
    name: 'Premium',
    price: 1000000,
    period: 'bulan',
    popular: false,
    description: 'Paket premium',
    features: ['Feature 1', 'Feature 2']
  }
]

// Ubah payment method (baris ~60)
const paymentMethods = [
  { id: 'new_method', name: 'New Method', icon: '💵' }
]
```

---

### 5. Dashboard
**File**: `frontend/src/components/Dashboard.jsx`

**Yang bisa dimodifikasi:**
- ✅ Stat cards (tambah/kurangi)
- ✅ Warna stat cards
- ✅ Icon stat cards
- ✅ Refresh interval
- ✅ Recent alarms count

**Contoh modifikasi:**
```jsx
// Ubah refresh interval (baris ~13)
const interval = setInterval(fetchStats, 60000)  // dari 30 detik jadi 60 detik

// Tambah stat card baru (duplikat div di baris ~30)
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">New Stat</p>
      <p className="text-3xl font-bold">0</p>
    </div>
    <div className="text-4xl">📊</div>
  </div>
</div>
```

---

### 6. OLT Management
**File**: `frontend/src/components/OltManagement.jsx`

**Yang bisa dimodifikasi:**
- ✅ Table columns (tambah/kurangi)
- ✅ Table header color
- ✅ Status badge colors
- ✅ Modal style
- ✅ Form fields

**Contoh modifikasi:**
```jsx
// Ubah warna table header (baris ~50)
<thead className="bg-blue-600 text-white">  // dari bg-gray-50

// Tambah column baru
<th className="...">New Column</th>
<td className="...">{olt.newField}</td>
```

---

### 7. ONU Management
**File**: `frontend/src/components/OnuManagement.jsx`

**Yang bisa dimodifikasi:**
- ✅ Filter style
- ✅ Table columns
- ✅ Status colors
- ✅ Pagination

**Contoh modifikasi:**
```jsx
// Ubah per_page (baris ~27)
let url = `${apiBase}/onus?per_page=50`  // dari 100 jadi 50

// Tambah column
<th className="...">New Column</th>
```

---

### 8. Provisioning
**File**: `frontend/src/components/Provisioning.jsx`

**Yang bisa dimodifikasi:**
- ✅ Form layout (grid columns)
- ✅ Form fields
- ✅ PPPoE section style
- ✅ Button style

**Contoh modifikasi:**
```jsx
// Ubah grid menjadi 3 kolom (baris ~80)
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

// Tambah field baru
<div>
  <label>New Field</label>
  <input type="text" name="newField" />
</div>
```

---

### 9. Alarms
**File**: `frontend/src/components/Alarms.jsx`

**Yang bisa dimodifikasi:**
- ✅ Severity colors
- ✅ Card style
- ✅ Filter style
- ✅ Action buttons
- ✅ Refresh interval

**Contoh modifikasi:**
```jsx
// Ubah warna severity (baris ~50)
const severityColors = {
  critical: 'bg-red-200 text-red-900',  // lebih gelap
  // ...
}

// Ubah refresh interval (baris ~11)
const interval = setInterval(fetchAlarms, 60000)  // 60 detik
```

---

### 10. Maps
**File**: `frontend/src/components/Maps.jsx`

**Yang bisa dimodifikasi:**
- ✅ Map size (SVG width/height)
- ✅ Marker colors
- ✅ Marker size
- ✅ Info cards layout
- ✅ Ganti dengan library maps (Leaflet/Google Maps)

**Contoh modifikasi:**
```jsx
// Ubah map size (baris ~70)
<svg width="100%" height="800" viewBox="0 0 800 800">  // dari 600 jadi 800

// Ubah warna marker OLT (baris ~80)
fill="#purple"  // dari blue

// Ubah size marker (baris ~79)
r="12"  // dari 8 jadi 12
```

---

### 11. Client API
**File**: `frontend/src/components/ClientApi.jsx`

**Yang bisa dimodifikasi:**
- ✅ Endpoint cards (tambah/kurangi)
- ✅ Card colors
- ✅ Summary cards gradient
- ✅ Table style
- ✅ JSON viewer style

**Contoh modifikasi:**
```jsx
// Tambah endpoint baru (baris ~10)
const endpoints = [
  // ... existing
  { value: 'new_endpoint', label: 'New Endpoint', icon: '🔔', color: 'pink' }
]

// Ubah warna summary card (baris ~180)
<div className="bg-gradient-to-br from-purple-500 to-pink-600 ...">
```

---

## 🎨 Modifikasi Warna Global

### Mengubah Warna Primary

Cari dan ganti di semua file:
- `bg-blue-600` → `bg-purple-600`
- `text-blue-600` → `text-purple-600`
- `border-blue-500` → `border-purple-500`

### Mengubah Warna Secondary

- `bg-indigo-600` → `bg-green-600`
- `from-blue-600 to-indigo-600` → `from-green-600 to-emerald-600`

---

## 📐 Modifikasi Layout

### Mengubah Grid Columns

```jsx
// 2 kolom
className="grid grid-cols-1 md:grid-cols-2"

// 3 kolom
className="grid grid-cols-1 md:grid-cols-3"

// 4 kolom
className="grid grid-cols-1 md:grid-cols-4"
```

### Mengubah Spacing

```jsx
// Padding lebih besar
className="p-8"  // dari p-6

// Margin lebih besar
className="mb-8"  // dari mb-6

// Gap lebih besar
className="gap-8"  // dari gap-4
```

---

## 🔤 Modifikasi Typography

### Mengubah Font Size

```jsx
// Heading lebih besar
className="text-6xl"  // dari text-4xl

// Body text lebih kecil
className="text-sm"  // dari text-base
```

### Mengubah Font Weight

```jsx
className="font-bold"  // tebal
className="font-semibold"  // semi tebal
className="font-normal"  // normal
```

---

## 🎭 Modifikasi Animasi

### Hover Effects

```jsx
// Scale on hover
className="hover:scale-105 transition-transform"

// Color change
className="hover:bg-blue-700 transition-colors"

// Shadow change
className="hover:shadow-xl transition-shadow"
```

---

## 📱 Responsive Design

### Breakpoints

```jsx
// Mobile only
className="block md:hidden"

// Desktop only
className="hidden md:block"

// Tablet and up
className="hidden lg:block"
```

---

## ✅ Checklist Modifikasi

Sebelum deploy, pastikan:
- [ ] Semua warna sesuai brand
- [ ] Font readable di semua device
- [ ] Spacing nyaman
- [ ] Responsive di mobile
- [ ] Animasi smooth
- [ ] Loading states ada
- [ ] Error handling ada
- [ ] Dokumentasi sudah ditambahkan

---

## 🆘 Bantuan

Jika ada pertanyaan:
1. Lihat komentar `MODIFIKASI` di setiap file
2. Check `PANDUAN_MODIFIKASI.md` untuk detail
3. Referensi Tailwind: https://tailwindcss.com/docs

---

## 📝 Catatan Penting

- **Selalu backup** sebelum modifikasi besar
- **Test di browser** setelah modifikasi
- **Check responsive** di mobile dan desktop
- **Update dokumentasi** jika menambah fitur baru

