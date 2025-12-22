/**
 * Client API Component
 * 
 * Halaman untuk integrasi dan menampilkan data dari API Client (165.99.239.14:1661)
 * 
 * PROPS:
 * - apiBase: string - Base URL untuk API backend
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah endpoint cards: Edit array endpoints, tambah/kurangi endpoint
 * - Ubah warna cards: Edit className di endpoint cards (bg-{color}-50)
 * - Ubah summary cards: Edit gradient di summary cards (from-blue-500 to-blue-600)
 * - Ubah table style: Edit className di table (bg-white, shadow-lg)
 * - Ubah JSON viewer: Edit className di pre tag (bg-gray-900, text-green-400)
 * - Tambah endpoint baru: Duplikat object di array endpoints
 */
import { useState, useEffect } from 'react'

export default function ClientApi({ apiBase }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [endpoint, setEndpoint] = useState('test')
    const [customEndpoint, setCustomEndpoint] = useState('')
    const [lastUpdated, setLastUpdated] = useState(null)

    // Ubah endpoint di sini - tambah/kurangi endpoint
    const endpoints = [
        { value: 'health', label: 'Health Check', icon: '💚', color: 'green' },
        { value: 'data', label: 'All Data', icon: '📦', color: 'blue' },
        { value: 'devices', label: 'Devices', icon: '📱', color: 'purple' },
        { value: 'status', label: 'Status', icon: '📊', color: 'indigo' },
        { value: 'metrics', label: 'Metrics', icon: '📈', color: 'orange' },
        { value: 'test', label: 'Test Connection', icon: '🔍', color: 'teal' },
    ]

    const fetchData = async (selectedEndpoint = endpoint) => {
        setLoading(true)
        setError(null)

        try {
            let url = `${apiBase}/client/${selectedEndpoint}`

            if (selectedEndpoint === 'custom' && customEndpoint) {
                url = `${apiBase}/client/custom?endpoint=${encodeURIComponent(customEndpoint)}`
            }

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)
            setLastUpdated(new Date())
        } catch (err) {
            setError(err.message)
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEndpointChange = (newEndpoint) => {
        setEndpoint(newEndpoint)
        if (newEndpoint !== 'custom') {
            fetchData(newEndpoint)
        }
    }

    const handleCustomFetch = () => {
        if (customEndpoint) {
            fetchData('custom')
        }
    }

    // Ubah warna status badge di sini
    const getStatusColor = (status) => {
        if (typeof status === 'string') {
            if (status.toLowerCase().includes('online') || status.toLowerCase().includes('ok') || status.toLowerCase().includes('success')) {
                return 'bg-green-100 text-green-800 border-green-300'
            }
            if (status.toLowerCase().includes('offline') || status.toLowerCase().includes('error') || status.toLowerCase().includes('fail')) {
                return 'bg-red-100 text-red-800 border-red-300'
            }
        }
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }

    return (
        <div className="space-y-6">
            {/* Header - Ubah style header di sini */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Client API Integration</h2>
                    <p className="text-gray-600 mt-1">Data dari API Client: 165.99.239.14:1661</p>
                </div>
                {lastUpdated && (
                    <div className="text-sm text-gray-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Endpoint Selector Cards - Ubah grid dan warna di sini */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {endpoints.map((ep) => (
                    <button
                        key={ep.value}
                        onClick={() => handleEndpointChange(ep.value)}
                        className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${endpoint === ep.value
                                ? `bg-${ep.color}-50 border-${ep.color}-500 shadow-lg`
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                    >
                        <div className="text-3xl mb-2">{ep.icon}</div>
                        <div className={`text-sm font-medium ${endpoint === ep.value ? `text-${ep.color}-700` : 'text-gray-700'
                            }`}>
                            {ep.label}
                        </div>
                    </button>
                ))}
            </div>

            {/* Custom Endpoint Card - Ubah style card di sini */}
            {endpoint === 'custom' && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Custom Endpoint Path
                    </label>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-gray-300">
                                <span className="text-gray-500 font-mono text-sm">/api/</span>
                                <input
                                    type="text"
                                    value={customEndpoint}
                                    onChange={(e) => setCustomEndpoint(e.target.value)}
                                    placeholder="custom/data"
                                    className="flex-1 outline-none text-sm"
                                    onKeyPress={(e) => e.key === 'Enter' && handleCustomFetch()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleCustomFetch}
                            disabled={!customEndpoint || loading}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            {loading ? 'Loading...' : 'Fetch'}
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons - Ubah style button di sini */}
            <div className="flex gap-3">
                <button
                    onClick={() => fetchData()}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <span>🔄</span>
                    {loading ? 'Loading...' : 'Refresh Data'}
                </button>
                {data && (
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                            alert('JSON copied to clipboard!')
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center gap-2"
                    >
                        <span>📋</span>
                        Copy JSON
                    </button>
                )}
            </div>

            {/* Error Display - Ubah style error di sini */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">⚠️</div>
                        <div className="flex-1">
                            <h3 className="text-red-800 font-semibold mb-1">Connection Error</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                            <p className="text-red-600 text-xs mt-2">
                                Pastikan API client di 165.99.239.14:1661 dapat diakses
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State - Ubah style loading di sini */}
            {loading && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading data from client API...</p>
                    <p className="text-gray-500 text-sm mt-2">165.99.239.14:1661</p>
                </div>
            )}

            {/* Data Display */}
            {data && !loading && (
                <div className="space-y-6">
                    {/* Success Banner - Ubah style banner di sini */}
                    {data.success && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                            <div className="text-2xl">✅</div>
                            <div className="flex-1">
                                <p className="font-semibold text-green-800">Connection Successful</p>
                                <p className="text-sm text-green-700">Data retrieved from API client</p>
                            </div>
                            <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-mono">
                                {data.source || '165.99.239.14:1661'}
                            </div>
                        </div>
                    )}

                    {/* Summary Cards - Ubah gradient di sini */}
                    {(data.count !== undefined || data.devices) && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {data.count !== undefined && (
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="text-sm opacity-90 mb-1">Total Items</div>
                                    <div className="text-3xl font-bold">{data.count}</div>
                                </div>
                            )}
                            {data.devices && (
                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="text-sm opacity-90 mb-1">Devices</div>
                                    <div className="text-3xl font-bold">{data.devices.length || 0}</div>
                                </div>
                            )}
                            {data.status && typeof data.status === 'object' && (
                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                                    <div className="text-sm opacity-90 mb-1">Status</div>
                                    <div className="text-lg font-semibold">Available</div>
                                </div>
                            )}
                            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="text-sm opacity-90 mb-1">Source</div>
                                <div className="text-xs font-mono truncate">{data.source || 'API Client'}</div>
                            </div>
                        </div>
                    )}

                    {/* Devices Table - Ubah style table di sini */}
                    {data.devices && Array.isArray(data.devices) && data.devices.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span>📱</span>
                                    Devices List ({data.devices.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {Object.keys(data.devices[0]).map((key) => (
                                                <th
                                                    key={key}
                                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    {key.replace(/_/g, ' ')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.devices.map((device, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                {Object.entries(device).map(([key, value], valIdx) => (
                                                    <td key={valIdx} className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {key.toLowerCase().includes('status') ? (
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                                                                {String(value)}
                                                            </span>
                                                        ) : typeof value === 'object' ? (
                                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                {JSON.stringify(value)}
                                                            </code>
                                                        ) : (
                                                            <span className="text-gray-900">{String(value)}</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Status Display - Ubah style status cards di sini */}
                    {data.status && typeof data.status === 'object' && (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span>📊</span>
                                    Status Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(data.status).map(([key, value]) => (
                                        <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="text-xs text-gray-500 uppercase mb-1">{key.replace(/_/g, ' ')}</div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Metrics Display - Ubah style metrics di sini */}
                    {data.metrics && (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span>📈</span>
                                    Metrics
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {Object.entries(data.metrics).map(([key, value]) => (
                                        <div key={key} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                                            <div className="text-xs text-gray-600 uppercase mb-2">{key.replace(/_/g, ' ')}</div>
                                            <div className="text-2xl font-bold text-orange-700">
                                                {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* JSON Viewer - Ubah style JSON viewer di sini */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>📄</span>
                                Raw JSON Response
                            </h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                                    alert('JSON copied!')
                                }}
                                className="text-sm bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                        <div className="p-6 bg-gray-900">
                            <pre className="text-green-400 text-sm overflow-auto max-h-96 font-mono">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State - Ubah style empty state di sini */}
            {!data && !loading && !error && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
                    <p className="text-gray-500 mb-6">Select an endpoint to fetch data from API client</p>
                    <button
                        onClick={() => fetchData('test')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Test Connection
                    </button>
                </div>
            )}
        </div>
    )
}
