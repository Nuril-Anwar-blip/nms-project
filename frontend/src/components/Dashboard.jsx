/**
 * Dashboard Component dengan Layout Modern
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah grid layout: Edit grid-cols untuk mengubah jumlah kolom
 * - Ubah warna cards: Edit gradient di stat cards
 * - Tambah chart: Install chart library (recharts, chart.js)
 * - Ubah refresh interval: Edit angka di setInterval
 */
import { useState, useEffect } from 'react'

export default function Dashboard({ apiBase }) {
    const [stats, setStats] = useState({
        olts: { total: 0, online: 0, offline: 0 },
        onus: { total: 0, online: 0, offline: 0 },
        alarms: { total: 0, critical: 0, major: 0 },
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchStats = async () => {
        try {
            const [oltsRes, onusRes, alarmsRes] = await Promise.all([
                fetch(`${apiBase}/olts`),
                fetch(`${apiBase}/onus?per_page=1`),
                fetch(`${apiBase}/alarms?status=active&per_page=1`),
            ])

            const olts = await oltsRes.json()
            const onus = await onusRes.json()
            const alarms = await alarmsRes.json()

            const oltsOnline = olts.filter(o => o.status === 'online').length
            const onusOnline = onus.data?.filter(o => o.status === 'online').length || 0

            setStats({
                olts: {
                    total: olts.length,
                    online: oltsOnline,
                    offline: olts.length - oltsOnline,
                },
                onus: {
                    total: onus.total || 0,
                    online: onusOnline,
                    offline: (onus.total || 0) - onusOnline,
                },
                alarms: {
                    total: alarms.total || 0,
                    critical: alarms.data?.filter(a => a.severity === 'critical').length || 0,
                    major: alarms.data?.filter(a => a.severity === 'major').length || 0,
                },
            })
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch stats:', error)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid dengan Layout Modern - Ubah grid di sini */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* OLTs Card - Duplikat untuk card baru */}
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <span className="text-3xl">🔌</span>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">{stats.olts.total}</div>
                            <div className="text-sm opacity-90">Total OLTs</div>
                        </div>
                    </div>
                    <div className="flex space-x-4 text-sm">
                        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
                            <div className="font-bold text-lg">{stats.olts.online}</div>
                            <div className="text-xs opacity-80">Online</div>
                        </div>
                        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
                            <div className="font-bold text-lg">{stats.olts.offline}</div>
                            <div className="text-xs opacity-80">Offline</div>
                        </div>
                    </div>
                </div>

                {/* ONUs Card */}
                <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <span className="text-3xl">📡</span>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">{stats.onus.total}</div>
                            <div className="text-sm opacity-90">Total ONUs</div>
                        </div>
                    </div>
                    <div className="flex space-x-4 text-sm">
                        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
                            <div className="font-bold text-lg">{stats.onus.online}</div>
                            <div className="text-xs opacity-80">Online</div>
                        </div>
                        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
                            <div className="font-bold text-lg">{stats.onus.offline}</div>
                            <div className="text-xs opacity-80">Offline</div>
                        </div>
                    </div>
                </div>

                {/* Alarms Card */}
                <div className="bg-gradient-to-br from-red-500 via-red-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <span className="text-3xl">🚨</span>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">{stats.alarms.total}</div>
                            <div className="text-sm opacity-90">Active Alarms</div>
                        </div>
                    </div>
                    <div className="flex space-x-4 text-sm">
                        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
                            <div className="font-bold text-lg">{stats.alarms.critical}</div>
                            <div className="text-xs opacity-80">Critical</div>
                        </div>
                        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
                            <div className="font-bold text-lg">{stats.alarms.major}</div>
                            <div className="text-xs opacity-80">Major</div>
                        </div>
                    </div>
                </div>

                {/* Network Health Card */}
                <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <span className="text-3xl">💚</span>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold">
                                {stats.olts.total > 0
                                    ? Math.round((stats.olts.online / stats.olts.total) * 100)
                                    : 0}%
                            </div>
                            <div className="text-sm opacity-90">Network Health</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="bg-white bg-opacity-20 rounded-full h-2">
                            <div
                                className="bg-white rounded-full h-2 transition-all duration-500"
                                style={{
                                    width: `${stats.olts.total > 0 ? (stats.olts.online / stats.olts.total) * 100 : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Alarms - Lebih besar */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>🚨</span>
                            Recent Alarms
                        </h3>
                    </div>
                    <RecentAlarms apiBase={apiBase} />
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                        🔌
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">OLTs Online</p>
                                        <p className="text-lg font-bold text-gray-900">{stats.olts.online}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                                        📡
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">ONUs Online</p>
                                        <p className="text-lg font-bold text-gray-900">{stats.onus.online}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                                        🚨
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Critical Alarms</p>
                                        <p className="text-lg font-bold text-gray-900">{stats.alarms.critical}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">API Status</span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Database</span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Connected
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">SNMP Service</span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RecentAlarms({ apiBase }) {
    const [alarms, setAlarms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${apiBase}/alarms?status=active&per_page=5`)
            .then(res => res.json())
            .then(data => {
                setAlarms(data.data || [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch alarms:', err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="p-6 text-center">Loading...</div>

    if (alarms.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-600 font-medium">No active alarms</p>
                <p className="text-sm text-gray-500 mt-2">All systems operational</p>
            </div>
        )
    }

    const severityColors = {
        critical: 'bg-red-100 text-red-800 border-red-300',
        major: 'bg-orange-100 text-orange-800 border-orange-300',
        minor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        warning: 'bg-blue-100 text-blue-800 border-blue-300',
        info: 'bg-gray-100 text-gray-800 border-gray-300',
    }

    return (
        <div className="divide-y">
            {alarms.map((alarm) => (
                <div key={alarm.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${alarm.severity === 'critical' ? 'bg-red-100' :
                                alarm.severity === 'major' ? 'bg-orange-100' :
                                    'bg-yellow-100'
                            }`}>
                            <span className="text-2xl">
                                {alarm.severity === 'critical' ? '🔴' :
                                    alarm.severity === 'major' ? '🟠' : '🟡'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[alarm.severity] || severityColors.info}`}>
                                    {alarm.severity}
                                </span>
                                <span className="font-semibold text-gray-900">{alarm.type}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{alarm.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{alarm.olt?.name || 'Unknown OLT'}</span>
                                <span>•</span>
                                <span>{new Date(alarm.occurred_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
