/**
 * Maps Component
 * 
 * Halaman untuk visualisasi peta jaringan OLT dan ONU
 * 
 * PROPS:
 * - apiBase: string - Base URL untuk API
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah map size: Edit width dan height di SVG (800x600)
 * - Ubah warna marker: Edit fill di circle (fill="#2563eb")
 * - Ubah marker size: Edit r di circle (r="8")
 * - Ganti dengan library maps: Install react-leaflet atau google-maps-react
 * - Ubah legend: Edit div dengan className "mb-4 flex space-x-4"
 * - Ubah info cards: Edit style di grid cards
 */
import { useState, useEffect } from 'react'

export default function Maps({ apiBase }) {
    const [olts, setOlts] = useState([])
    const [onus, setOnus] = useState([])
    const [loading, setLoading] = useState(true)
    const [showOnus, setShowOnus] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [oltsRes, onusRes] = await Promise.all([
                fetch(`${apiBase}/maps/olts`),
                fetch(`${apiBase}/maps/onus`),
            ])

            const oltsData = await oltsRes.json()
            const onusData = await onusRes.json()

            setOlts(oltsData)
            setOnus(onusData)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch map data:', error)
            setLoading(false)
        }
    }

    if (loading) return <div className="text-center py-12">Loading map...</div>

    // Simple map visualization using SVG
    // GANTI DENGAN LIBRARY MAPS (Leaflet/Google Maps) untuk tampilan lebih baik
    const allPoints = [
        ...olts.map(olt => ({ ...olt, type: 'olt' })),
        ...(showOnus ? onus.map(onu => ({ ...onu, type: 'onu' })) : []),
    ]

    const bounds = allPoints.length > 0 ? {
        minLat: Math.min(...allPoints.map(p => p.latitude)),
        maxLat: Math.max(...allPoints.map(p => p.latitude)),
        minLng: Math.min(...allPoints.map(p => p.longitude)),
        maxLng: Math.max(...allPoints.map(p => p.longitude)),
    } : null

    // Normalize coordinates untuk SVG
    const normalizePoint = (lat, lng) => {
        if (!bounds) return { x: 0, y: 0 }
        const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 800
        const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 600
        return { x, y }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Network Maps</h2>
                {/* Toggle - Ubah style toggle di sini */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="show_onus"
                        checked={showOnus}
                        onChange={(e) => setShowOnus(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="show_onus" className="text-sm">Show ONUs</label>
                </div>
            </div>

            {allPoints.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                    No location data available. Please add coordinates to OLTs and ONUs.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-6">
                    {/* Legend - Ubah style legend di sini */}
                    <div className="mb-4 flex space-x-4 text-sm">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                            <span>OLT ({olts.length})</span>
                        </div>
                        {showOnus && (
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                                <span>ONU ({onus.length})</span>
                            </div>
                        )}
                    </div>

                    {/* SVG Map - Ubah size dan style di sini */}
                    <svg width="100%" height="600" viewBox="0 0 800 600" className="border rounded">
                        {/* OLT Markers - Ubah warna dan size di sini */}
                        {olts.map((olt) => {
                            const { x, y } = normalizePoint(olt.latitude, olt.longitude)
                            return (
                                <g key={`olt-${olt.id}`}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="8"  // Ubah size marker di sini
                                        fill="#2563eb"  // Ubah warna di sini
                                        stroke="white"
                                        strokeWidth="2"
                                        className="cursor-pointer"
                                    />
                                    <text
                                        x={x}
                                        y={y - 15}
                                        textAnchor="middle"
                                        className="text-xs fill-gray-700 font-medium"
                                    >
                                        {olt.name}
                                    </text>
                                </g>
                            )
                        })}

                        {/* ONU Markers - Ubah warna dan size di sini */}
                        {showOnus && onus.map((onu) => {
                            const { x, y } = normalizePoint(onu.latitude, onu.longitude)
                            return (
                                <g key={`onu-${onu.id}`}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="4"  // Ubah size marker di sini
                                        fill="#16a34a"  // Ubah warna di sini
                                        stroke="white"
                                        strokeWidth="1"
                                        className="cursor-pointer"
                                    />
                                </g>
                            )
                        })}
                    </svg>

                    {/* Info Cards - Ubah grid layout di sini */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {olts.map((olt) => (
                            <div key={olt.id} className="border rounded p-4">
                                <h3 className="font-semibold">{olt.name}</h3>
                                <p className="text-sm text-gray-600">{olt.ip_address}</p>
                                <div className="mt-2 flex space-x-4 text-xs">
                                    <span className={`px-2 py-1 rounded ${olt.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {olt.status}
                                    </span>
                                    <span>ONUs: {olt.onus_count}</span>
                                    <span>Alarms: {olt.active_alarms_count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
