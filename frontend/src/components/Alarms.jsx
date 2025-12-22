/**
 * Alarms Component
 * 
 * Halaman untuk melihat dan mengelola alarms
 * 
 * PROPS:
 * - apiBase: string - Base URL untuk API
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah warna severity: Edit severityColors object
 * - Ubah filter style: Edit className di select dropdown
 * - Ubah card style: Edit className di alarm card
 * - Ubah button style: Edit className di action buttons
 * - Ubah refresh interval: Edit angka di setInterval (30000)
 */
import { useState, useEffect } from 'react'

export default function Alarms({ apiBase }) {
    const [alarms, setAlarms] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('active')
    const [filterSeverity, setFilterSeverity] = useState('')

    useEffect(() => {
        fetchAlarms()
        // Ubah interval refresh di sini (30000 = 30 detik)
        const interval = setInterval(fetchAlarms, 30000)
        return () => clearInterval(interval)
    }, [filterStatus, filterSeverity])

    const fetchAlarms = async () => {
        try {
            let url = `${apiBase}/alarms?per_page=100`
            if (filterStatus) url += `&status=${filterStatus}`
            if (filterSeverity) url += `&severity=${filterSeverity}`

            const res = await fetch(url)
            const data = await res.json()
            setAlarms(data.data || data)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch alarms:', error)
            setLoading(false)
        }
    }

    const handleAcknowledge = async (id) => {
        try {
            await fetch(`${apiBase}/alarms/${id}/acknowledge`, { method: 'POST' })
            fetchAlarms()
        } catch (error) {
            console.error('Failed to acknowledge alarm:', error)
        }
    }

    const handleClear = async (id) => {
        try {
            await fetch(`${apiBase}/alarms/${id}/clear`, { method: 'POST' })
            fetchAlarms()
        } catch (error) {
            console.error('Failed to clear alarm:', error)
        }
    }

    // Ubah warna severity badge di sini
    const severityColors = {
        critical: 'bg-red-100 text-red-800 border-red-300',
        major: 'bg-orange-100 text-orange-800 border-orange-300',
        minor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        warning: 'bg-blue-100 text-blue-800 border-blue-300',
        info: 'bg-gray-100 text-gray-800 border-gray-300',
    }

    if (loading) return <div className="text-center py-12">Loading...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Alarms</h2>
                {/* Filter - Ubah style filter di sini */}
                <div className="flex space-x-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="active">Active</option>
                        <option value="cleared">Cleared</option>
                        <option value="acknowledged">Acknowledged</option>
                    </select>
                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="major">Major</option>
                        <option value="minor">Minor</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                    </select>
                </div>
            </div>

            {/* Alarms List - Ubah style card di sini */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {alarms.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No alarms found</div>
                ) : (
                    <div className="divide-y">
                        {alarms.map((alarm) => (
                            <div
                                key={alarm.id}
                                className={`p-6 border-l-4 ${severityColors[alarm.severity] || severityColors.info}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="font-semibold text-lg">{alarm.type}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[alarm.severity] || severityColors.info}`}>
                                                {alarm.severity}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {alarm.olt?.name || 'Unknown OLT'}
                                                {alarm.onu && ` - ONU: ${alarm.onu.serial_number}`}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{alarm.message}</p>
                                        {alarm.details && (
                                            <p className="text-sm text-gray-600 mb-2">{alarm.details}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {new Date(alarm.occurred_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {/* Action Buttons - Ubah style button di sini */}
                                    <div className="flex space-x-2 ml-4">
                                        {alarm.status === 'active' && (
                                            <>
                                                <button
                                                    onClick={() => handleAcknowledge(alarm.id)}
                                                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                                                >
                                                    Acknowledge
                                                </button>
                                                <button
                                                    onClick={() => handleClear(alarm.id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                >
                                                    Clear
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
