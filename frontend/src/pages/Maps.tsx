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

import { useState, useEffect } from 'react'
import { useOlts } from '../hooks/useOlts'
import { useOnus } from '../hooks/useOnus'
import Card from '../components/Card'

export default function Maps() {
  const { olts } = useOlts()
  const { onus, fetchOnus } = useOnus()
  const [selectedOlt, setSelectedOlt] = useState<number | ''>('')

  useEffect(() => {
    if (selectedOlt) {
      fetchOnus({ olt_id: selectedOlt as number })
    } else {
      fetchOnus()
    }
  }, [selectedOlt, fetchOnus])

  return (
    <div className="space-y-6">
      <Card title="Geographic Map">
        {/* Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by OLT</label>
          <select
            value={selectedOlt}
            onChange={(e) => setSelectedOlt(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 max-w-xs"
          >
            <option value="">All OLTs</option>
            {olts.map(olt => (
              <option key={olt.id} value={olt.id}>{olt.name}</option>
            ))}
          </select>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-600 font-medium">Map Integration</p>
            <p className="text-sm text-gray-500 mt-2">
              Integrate with Leaflet or Google Maps API to display OLT and ONU locations
            </p>
            <div className="mt-4 text-sm text-gray-600">
              <p>OLTs with coordinates: {olts.filter(o => o.latitude && o.longitude).length}</p>
              <p>ONUs with locations: {onus.filter(o => o.location_id).length}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Integration Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Install Leaflet: npm install leaflet react-leaflet</li>
            <li>Or use Google Maps: npm install @react-google-maps/api</li>
            <li>Add map component with markers for OLTs and ONUs</li>
            <li>Use latitude/longitude from database for marker positions</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
