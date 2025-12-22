/**
 * ONU Management Component dengan Layout Modern
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah filter style: Edit className di filter cards
 * - Ubah table style: Edit className di table container
 * - Ubah status colors: Edit statusColors object
 * - Tambah search: Sudah ada search box
 */
import { useState, useEffect } from 'react'

export default function OnuManagement({ apiBase }) {
    const [onus, setOnus] = useState([])
    const [olts, setOlts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterOlt, setFilterOlt] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchOlts()
        fetchOnus()
    }, [filterOlt, filterStatus])

    const fetchOlts = async () => {
        try {
            const res = await fetch(`${apiBase}/olts`)
            const data = await res.json()
            setOlts(data)
        } catch (error) {
            console.error('Failed to fetch OLTs:', error)
        }
    }

    const fetchOnus = async () => {
        try {
            let url = `${apiBase}/onus?per_page=100`
            if (filterOlt) url += `&olt_id=${filterOlt}`
            if (filterStatus) url += `&status=${filterStatus}`

            const res = await fetch(url)
            const data = await res.json()
            setOnus(data.data || data)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch ONUs:', error)
            setLoading(false)
        }
    }

    const statusColors = {
        online: 'bg-green-100 text-green-800 border-green-300',
        offline: 'bg-red-100 text-red-800 border-red-300',
        unknown: 'bg-gray-100 text-gray-800 border-gray-300',
    }

    const filteredOnus = onus.filter(onu =>
        onu.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        onu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        onu.olt?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Loading ONUs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">ONU Management</h2>
                    <p className="text-gray-600 mt-1">Monitor and manage all ONU devices</p>
                </div>
                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search ONUs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Filter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by OLT</label>
                    <select
                        value={filterOlt}
                        onChange={(e) => setFilterOlt(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All OLTs</option>
                        {olts.map((olt) => (
                            <option key={olt.id} value={olt.id}>
                                {olt.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                    <div className="text-sm text-gray-600 mb-1">Total ONUs</div>
                    <div className="text-2xl font-bold text-purple-600">{onus.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="text-sm text-gray-600 mb-1">Online</div>
                    <div className="text-2xl font-bold text-green-600">
                        {onus.filter(o => o.status === 'online').length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                    <div className="text-sm text-gray-600 mb-1">Offline</div>
                    <div className="text-2xl font-bold text-red-600">
                        {onus.filter(o => o.status === 'offline').length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">Unknown</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {onus.filter(o => o.status === 'unknown').length}
                    </div>
                </div>
            </div>

            {/* Table dengan Card Style */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Serial Number</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">OLT</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PON Port</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ONU ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">RX Power</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TX Power</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOnus.map((onu) => (
                                <tr key={onu.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">{onu.serial_number}</code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{onu.name || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2">
                                                {onu.olt?.name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-gray-700">{onu.olt?.name || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{onu.pon_port}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                                            {onu.onu_id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[onu.status] || statusColors.unknown}`}>
                                            {onu.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {onu.rx_power !== null ? (
                                            <span className={`font-medium ${onu.rx_power > -20 ? 'text-green-600' : onu.rx_power > -25 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {onu.rx_power} dBm
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {onu.tx_power !== null ? (
                                            <span className="font-medium text-gray-700">{onu.tx_power} dBm</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOnus.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">📡</div>
                        <p className="text-gray-600 font-medium">No ONUs found</p>
                        <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search</p>
                    </div>
                )}
            </div>
        </div>
    )
}
