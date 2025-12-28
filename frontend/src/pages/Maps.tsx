/** AUTO-DOC: src/pages/Maps.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/Maps.tsx
 * 
 * Halaman maps untuk menampilkan lokasi OLT dan ONU secara geografis
 * 
 * Fungsi:
 * - Menampilkan peta dengan marker OLT dan ONU
 * - Filter marker berdasarkan OLT atau status
 * - Klik marker untuk melihat detail
 * - Integrasi dengan Leaflet atau Google Maps API
 * 
 * Alur kerja:
 * 1. Load data OLT dan ONU dengan koordinat geografis
 * 2. Render peta menggunakan library maps
 * 3. Tambahkan marker untuk setiap OLT/ONU
 * 4. User dapat klik marker untuk melihat detail
 * 
 * Catatan:
 * - Membutuhkan API key untuk Google Maps (jika menggunakan)
 * - Leaflet adalah alternatif open source yang tidak memerlukan API key
 * - Koordinat geografis disimpan di tabel locations
 */

import { useState, useEffect, useMemo } from 'react'
import Card from '../components/cards/Card'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { getMapOlts, getMapOnus } from '../services/api'

/**
 * Halaman Maps: menampilkan OLT dan ONU di peta menggunakan Leaflet.
 * NOTE: Install dependencies terlebih dahulu:
 *   npm install leaflet react-leaflet
 */
export default function Maps() {
  const [olts, setOlts] = useState<any[]>([])
  const [onus, setOnus] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const [o, u] = await Promise.all([getMapOlts(), getMapOnus()])
        if (!mounted) return
        setOlts(o || [])
        setOnus(u || [])
      } catch (err) {
        console.error('Failed to load map data', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const center: LatLngExpression = useMemo(() => {
    // compute center from first olt or default to [0,0]
    const first = olts[0] || onus[0]
    const lat = first?.latitude ?? first?.lat ?? 0
    const lng = first?.longitude ?? first?.lng ?? 0
    return [lat, lng]
  }, [olts, onus])

  function toLatLng(item: any): [number, number] | null {
    const lat = item?.latitude ?? item?.lat
    const lng = item?.longitude ?? item?.lng
    if (lat === undefined || lng === undefined || lat === null || lng === null) return null
    const nLat = Number(lat)
    const nLng = Number(lng)
    if (Number.isNaN(nLat) || Number.isNaN(nLng)) return null
    return [nLat, nLng]
  }

  return (
    <div className="space-y-6">
      <Card title="Peta Geografis">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Menampilkan OLT (biru) dan ONU (hijau) dengan koordinat dari backend.</p>
        </div>

        <div className="rounded-lg overflow-hidden h-96">
          {loading ? (
            <div className="h-96 flex items-center justify-center">Memuat peta...</div>
          ) : (
            <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <MarkerClusterGroup>
                {olts.map((olt) => {
                  const pos = toLatLng(olt)
                  if (!pos) return null
                  const oltIcon = L.divIcon({
                    html: `<div style="background:#2563EB;width:14px;height:14px;border-radius:50%;border:2px solid white"></div>`,
                    className: ''
                  })
                  return (
                    <Marker key={`olt-${olt.id}`} position={pos} icon={oltIcon as any}>
                      <Popup>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{olt.name || olt.hostname || `OLT ${olt.id}`}</div>
                          {olt.ip_address && <div>IP: {olt.ip_address}</div>}
                          {olt.count !== undefined && <div>ONUs: {olt.count}</div>}
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}

                {onus.map((onu) => {
                  const pos = toLatLng(onu)
                  if (!pos) return null
                  const onuIcon = L.divIcon({
                    html: `<div style="background:#16A34A;width:10px;height:10px;border-radius:50%;border:2px solid white"></div>`,
                    className: ''
                  })
                  return (
                    <Marker key={`onu-${onu.id}`} position={pos} icon={onuIcon as any}>
                      <Popup>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{onu.name || onu.serial_number || `ONU ${onu.id}`}</div>
                          {onu.mac && <div>MAC: {onu.mac}</div>}
                          {onu.olt && <div>OLT: {onu.olt.name || onu.olt_id}</div>}
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MarkerClusterGroup>
            </MapContainer>
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Petunjuk Integrasi</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Pastikan menginstall: <span className="font-medium">leaflet</span> dan <span className="font-medium">react-leaflet</span></li>
            <li>Jika marker tidak tampil, periksa bahwa backend mengembalikan field koordinat (<em>latitude</em>, <em>longitude</em> atau <em>lat</em>, <em>lng</em>).</li>
            <li>Untuk ikon marker khusus, tambahkan konfigurasi icon Leaflet.</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
