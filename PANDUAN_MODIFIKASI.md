 # 📚 Panduan Lengkap Modifikasi Tampilan

Dokumentasi lengkap untuk memodifikasi tampilan semua komponen di NMS ZTE OLT.

## 📋 Daftar Isi

1. [Struktur File](#struktur-file)
2. [Landing Page](#landing-page)
3. [Login Page](#login-page)
4. [Register Page](#register-page)
5. [Buy/Purchase Page](#buypurchase-page)
6. [Dashboard Components](#dashboard-components)
7. [Client API Component](#client-api-component)
8. [Tips & Tricks](#tips--tricks)

---

## 📁 Struktur File

```
frontend/src/
├── App.jsx                    # Main routing & layout
├── components/
│   ├── LandingPage.jsx        # Halaman utama/promosi
│   ├── Login.jsx             # Halaman login
│   ├── Register.jsx           # Halaman register
│   ├── Buy.jsx                # Halaman beli/paket
│   ├── Dashboard.jsx          # Dashboard utama
│   ├── OltManagement.jsx      # Manajemen OLT
│   ├── OnuManagement.jsx      # Manajemen ONU
│   ├── Provisioning.jsx       # Provisioning ONU
│   ├── Alarms.jsx             # Manajemen alarm
│   ├── Maps.jsx               # Peta jaringan
│   └── ClientApi.jsx          # Integrasi API client
└── main.jsx                   # Entry point
```

---

## 🏠 Landing Page

**File**: `frontend/src/components/LandingPage.jsx`

### Modifikasi Warna

```jsx
// Ubah gradient background
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
// Ganti dengan:
<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
```

### Modifikasi Hero Section

```jsx
// Ubah judul utama (baris ~40)
<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
  Network Management System
  <span className="block text-blue-600 mt-2">untuk ZTE OLT</span>
</h1>

// Ubah subtitle (baris ~47)
<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
  Solusi lengkap untuk monitoring...
</p>
```

### Modifikasi Features

```jsx
// Tambah feature baru - duplikat block ini (baris ~80)
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
  <div className="text-4xl mb-4">📊</div>
  <h3 className="text-xl font-bold text-gray-900 mb-3">Nama Feature</h3>
  <p className="text-gray-600">
    Deskripsi feature
  </p>
</div>
```

### Modifikasi Pricing

```jsx
// Ubah paket (baris ~130)
<div className="bg-white rounded-xl p-8 shadow-lg">
  <h3 className="text-2xl font-bold text-gray-900 mb-2">Nama Paket</h3>
  <div className="mb-6">
    <span className="text-4xl font-bold text-blue-600">Rp 1.000.000</span>
    <span className="text-gray-600">/bulan</span>
  </div>
  // Ubah list fitur di sini
</div>
```

---

## 🔐 Login Page

**File**: `frontend/src/components/Login.jsx`

### Modifikasi Background

```jsx
// Ubah gradient (baris ~30)
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
// Ganti dengan warna lain:
<div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
```

### Modifikasi Form Card

```jsx
// Ubah warna card (baris ~35)
<div className="bg-white rounded-2xl shadow-2xl p-8">
// Ganti dengan:
<div className="bg-gray-900 rounded-2xl shadow-2xl p-8 text-white">
```

### Modifikasi Button

```jsx
// Ubah warna button (baris ~120)
className="... bg-gradient-to-r from-blue-600 to-indigo-600 ..."
// Ganti dengan:
className="... bg-gradient-to-r from-green-600 to-emerald-600 ..."
```

### Tambah Field Baru

```jsx
// Duplikat block ini untuk field baru (setelah baris ~70)
<div>
  <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700 mb-2">
    Label Field
  </label>
  <input
    id="fieldName"
    name="fieldName"
    type="text"
    required
    value={formData.fieldName}
    onChange={handleChange}
    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 ..."
    placeholder="Placeholder"
  />
</div>
```

---

## 📝 Register Page

**File**: `frontend/src/components/Register.jsx`

### Modifikasi Layout Grid

```jsx
// Ubah grid columns (baris ~50)
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// Ganti dengan 3 kolom:
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

### Modifikasi Validasi

```jsx
// Edit validasi password (baris ~30)
if (formData.password.length < 6) {
  setError('Password minimal 6 karakter')
  return
}
// Ubah menjadi:
if (formData.password.length < 8) {
  setError('Password minimal 8 karakter')
  return
}
```

### Tambah Field Baru

```jsx
// Tambah di formData state (baris ~10)
const [formData, setFormData] = useState({
  // ... existing fields
  newField: ''
})

// Tambah input field di form
<div>
  <label htmlFor="newField">New Field</label>
  <input
    id="newField"
    name="newField"
    value={formData.newField}
    onChange={handleChange}
    // ...
  />
</div>
```

---

## 💰 Buy/Purchase Page

**File**: `frontend/src/components/Buy.jsx`

### Modifikasi Paket

```jsx
// Edit array packages (baris ~20)
const packages = [
  {
    id: 'new_package',
    name: 'New Package',
    price: 1000000,
    period: 'bulan',
    popular: false,
    description: 'Deskripsi paket',
    features: [
      'Feature 1',
      'Feature 2',
      // Tambah fitur di sini
    ]
  }
]
```

### Modifikasi Payment Methods

```jsx
// Edit payment methods (baris ~60)
const paymentMethods = [
  { id: 'new_method', name: 'New Method', icon: '💵' }
  // Tambah metode pembayaran baru
]
```

### Modifikasi Form Checkout

```jsx
// Tambah field baru di formData (baris ~15)
const [formData, setFormData] = useState({
  // ... existing fields
  newField: ''
})

// Tambah input di form checkout
<div>
  <label>New Field</label>
  <input
    name="newField"
    value={formData.newField}
    onChange={handleChange}
  />
</div>
```

---

## 📊 Dashboard Components

### Dashboard.jsx

**Modifikasi Stat Cards:**
```jsx
// Ubah warna card (baris ~30)
<div className="bg-white rounded-lg shadow p-6">
// Ganti dengan gradient:
<div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow p-6 text-white">
```

**Tambah Stat Card Baru:**
```jsx
// Duplikat card (baris ~30)
<div className="bg-white rounded-lg shadow p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">Label</p>
      <p className="text-3xl font-bold">Value</p>
    </div>
    <div className="text-4xl">Icon</div>
  </div>
</div>
```

### OltManagement.jsx

**Modifikasi Table:**
```jsx
// Ubah warna header (baris ~50)
<thead className="bg-gray-50">
// Ganti dengan:
<thead className="bg-blue-600 text-white">
```

**Tambah Column:**
```jsx
// Tambah <th> di header
<th className="px-6 py-3">New Column</th>

// Tambah <td> di body
<td className="px-6 py-4">{olt.newField}</td>
```

### ClientApi.jsx

**Modifikasi Endpoint Cards:**
```jsx
// Ubah warna card (baris ~60)
className={`p-4 rounded-xl border-2 ... bg-${ep.color}-50 ...`}
// Ganti dengan warna custom:
className={`p-4 rounded-xl border-2 ... bg-purple-50 ...`}
```

**Modifikasi Summary Cards:**
```jsx
// Ubah gradient (baris ~180)
<div className="bg-gradient-to-br from-blue-500 to-blue-600 ...">
// Ganti dengan:
<div className="bg-gradient-to-br from-purple-500 to-pink-600 ...">
```

---

## 🎨 Tips & Tricks

### 1. Mengubah Warna Global

Edit di setiap komponen:
- `bg-blue-600` → `bg-purple-600`
- `text-blue-600` → `text-green-600`
- `border-blue-500` → `border-red-500`

### 2. Mengubah Font

```jsx
// Tambah di className
className="font-serif"  // atau font-mono, font-sans
```

### 3. Mengubah Spacing

```jsx
// Ubah padding/margin
className="p-4" → className="p-8"  // lebih besar
className="mb-4" → className="mb-8"  // lebih besar
```

### 4. Mengubah Border Radius

```jsx
className="rounded-lg" → className="rounded-xl"  // lebih bulat
className="rounded-lg" → className="rounded-full"  // bulat penuh
```

### 5. Mengubah Shadow

```jsx
className="shadow" → className="shadow-lg"  // lebih besar
className="shadow-lg" → className="shadow-2xl"  // sangat besar
```

### 6. Mengubah Animasi

```jsx
// Tambah hover effect
className="hover:scale-105 transition-transform"
className="hover:bg-blue-700 transition-colors"
```

### 7. Mengubah Grid Layout

```jsx
// Ubah jumlah kolom
className="grid grid-cols-1 md:grid-cols-3"
// Ganti dengan:
className="grid grid-cols-1 md:grid-cols-4"  // 4 kolom
```

---

## 🔧 Custom Styling

### Tambah Custom CSS

Buat file `frontend/src/custom.css`:

```css
.custom-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.custom-shadow {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

Import di komponen:
```jsx
import './custom.css'
```

### Menggunakan Inline Style

```jsx
<div style={{
  backgroundColor: '#your-color',
  padding: '20px',
  borderRadius: '10px'
}}>
  Content
</div>
```

---

## 📱 Responsive Design

### Breakpoints Tailwind

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

### Contoh Responsive

```jsx
// Mobile: 1 kolom, Desktop: 3 kolom
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

// Mobile: text kecil, Desktop: text besar
<h1 className="text-2xl md:text-4xl">

// Mobile: hidden, Desktop: visible
<div className="hidden md:block">
```

---

## 🎯 Quick Reference

### Warna Populer

- Blue: `blue-50` sampai `blue-900`
- Green: `green-50` sampai `green-900`
- Purple: `purple-50` sampai `purple-900`
- Red: `red-50` sampai `red-900`
- Gray: `gray-50` sampai `gray-900`

### Spacing

- `p-2` = 0.5rem (8px)
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `p-8` = 2rem (32px)

### Font Size

- `text-xs` = 0.75rem
- `text-sm` = 0.875rem
- `text-base` = 1rem
- `text-lg` = 1.125rem
- `text-xl` = 1.25rem
- `text-2xl` = 1.5rem
- `text-3xl` = 1.875rem
- `text-4xl` = 2.25rem

---

## 📞 Bantuan

Jika ada pertanyaan tentang modifikasi:
1. Check dokumentasi di setiap file komponen
2. Lihat contoh di komponen yang sudah ada
3. Referensi Tailwind CSS: https://tailwindcss.com/docs

---

## ✅ Checklist Modifikasi

- [ ] Warna sudah sesuai brand
- [ ] Font sudah readable
- [ ] Spacing sudah nyaman
- [ ] Responsive di mobile
- [ ] Animasi smooth
- [ ] Loading state ada
- [ ] Error handling ada
- [ ] Dokumentasi sudah ditambahkan

