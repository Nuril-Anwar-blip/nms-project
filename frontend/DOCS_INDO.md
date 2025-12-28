# Dokumentasi Singkat (Bahasa Indonesia)

Ringkasan: dokumentasi ini menjelaskan endpoint API utama yang dipakai frontend, cara integrasi peta (Maps), dan petunjuk singkat menjalankan dev server.

## Cara Menjalankan (frontend)
- Install dependensi (jalankan di folder `frontend`):

```bash
npm install
npm run dev
```

- Vite biasanya berjalan pada `http://localhost:5173`.

## Endpoint Backend yang Digunakan
- Autentikasi
  - `POST /api/auth/login` — body: `{ email, password }` -> respons token
  - `POST /api/auth/register` — body: `{ name, email, password, role? }` (saat ini register bisa saja memerlukan admin; cek backend)
  - `GET /api/auth/me` — ambil data user saat ini

- Maps & Locations
  - `GET /api/maps/olts` — OLT dengan koordinat; fields umum: `id, name, ip_address, latitude|lat, longitude|lng, count`
  - `GET /api/maps/onus` — ONU dengan koordinat; fields: `id, name, serial_number, mac, latitude|lat, longitude|lng, olt_id` (atau nested `olt`)
  - `GET /api/locations` — daftar lokasi (CRUD tersedia: `POST/PUT/DELETE /api/locations`)

- OLT / ONU / Provisioning
  - `GET /api/olts`, `GET /api/olts/:id`, `POST /api/olts`, `PUT /api/olts/:id`, `DELETE /api/olts/:id`
  - `GET /api/onus`, `POST /api/onus`, `PUT /api/onus/:id`, `DELETE /api/onus/:id`
  - Provisioning endpoints di `/api/provisioning/*` untuk operasi serial/name/reboot/reset

- Client integration (proxy ke sistem klien)
  - `GET /api/client/health`, `/api/client/data`, `/api/client/devices`, `/api/client/status`, `/api/client/metrics`, `/api/client/custom?endpoint=...`

## Cara Integrasi Peta (Maps)
1. Install paket Leaflet dan React binding di `frontend`:

```bash
npm install leaflet react-leaflet react-leaflet-markercluster leaflet.markercluster
npm install -D @types/leaflet
```

2. `frontend/src/pages/Maps.tsx` sudah menggunakan `react-leaflet` dan memanggil `getMapOlts()` / `getMapOnus()` dari `frontend/src/services/api.ts`.
   - Pastikan backend mengembalikan field koordinat berupa `latitude` & `longitude` atau `lat` & `lng`.
   - Marker clustering sudah diaktifkan menggunakan `react-leaflet-markercluster`.

3. Kustomisasi
   - Untuk ikon kustom, ubah pembuatan `L.divIcon` atau gunakan `L.icon` dengan gambar SVG/PNG.
   - Tambahkan legend menggunakan `frontend/src/components/ui/MapLegend.tsx`.

4. Troubleshooting
   - Marker tidak muncul: cek response JSON `GET /api/maps/olts` & `/api/maps/onus` (field lat/lng harus ada dan numerik).
   - Peta kosong: periksa koneksi tile layer (internet) atau CORS; tile layer default adalah OpenStreetMap.

## Komponen Stub yang Ditambahkan
- `frontend/src/components/common/IconButton.tsx` — wrapper `Button` AntD
- `frontend/src/components/table/DataTable.tsx` — wrapper `Table` AntD
- `frontend/src/components/ui/EntityCard.tsx` — wrapper `Card` kecil
- `frontend/src/components/ui/MapLegend.tsx` — legend peta sederhana
- `frontend/src/components/ui/LoadingSpinner.tsx` — wrapper `Spin` AntD
- `frontend/src/components/modals/ConfirmModal.tsx` — modal konfirmasi standar

Gunakan file-file tersebut sebagai titik awal untuk menambahkan style atau behavior yang Anda inginkan.

## Permintaan Pengembangan Backend (Wishlist untuk fitur mirip zetset.id)
- Field lokasi lebih lengkap: `address`, `city`, `region`, `postal_code`, `timezone`.
- Endpoint cluster/area aggregations — untuk pre-render heatmap/cluster di server.
- Public registration opsi (frontend register tanpa admin) — konfigurasi policy pada backend.
- Geocoding service untuk menyimpan koordinat dari alamat input (opsional, server-side job).

## Kontak & Langkah Selanjutnya
- Jika Anda ingin saya: (a) tambahkan legend + kontrol filter di `Maps.tsx`, (b) buat ikon SVG khusus, atau (c) perbaiki tampilan marker popups — beri tahu pilihan Anda.

