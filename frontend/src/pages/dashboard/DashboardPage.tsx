/** AUTO-DOC: src/pages/dashboard/DashboardPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/dashboard/DashboardPage.tsx
 * 
 * Halaman Dashboard utama aplikasi NMS
 * 
 * Fungsi:
 * - Menampilkan statistik real-time: Total OLT, ONU, Alarms
 * - Menampilkan performa OLT: CPU, Memory, Temperature
 * - Menampilkan alarm terbaru
 * - Auto-refresh setiap 30 detik
 * 
 * Data yang ditampilkan:
 * - Statistik OLT (total, online, offline)
 * - Statistik ONU (total, online, offline)
 * - Statistik Alarm (total, critical, major, minor)
 * - Network Health percentage
 * - Recent alarms list
 * - OLT performance metrics
 */

import { useState, useEffect } from 'react'
import { getDashboardStats, getOltPerformance, getRecentAlarms } from '../../services/api'
import type { DashboardStats, OltPerformance, Alarm } from '../../types'
import StatsCard from '../../components/cards/StatsCard'
import AlarmCard from '../../components/cards/AlarmCard'
import StatusBadge from '../../components/status/StatusBadge'
import SeverityBadge from '../../components/status/SeverityBadge'
import {
    ApiOutlined,
    WifiOutlined,
    AlertOutlined,
    CheckCircleOutlined
} from '@ant-design/icons'

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        total_olts: 0,
        online_olts: 0,
        offline_olts: 0,
        total_onus: 0,
        online_onus: 0,
        offline_onus: 0,
        active_alarms: 0,
        critical_alarms: 0,
        major_alarms: 0,
        minor_alarms: 0
    })
    const [oltPerformance, setOltPerformance] = useState<OltPerformance[]>([])
    const [recentAlarms, setRecentAlarms] = useState<Alarm[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, performanceData, alarmsData] = await Promise.all([
                    getDashboardStats(),
                    getOltPerformance(),
                    getRecentAlarms()
                ])
                setStats(statsData)
                setOltPerformance(performanceData)
                setRecentAlarms(alarmsData)
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        const interval = setInterval(fetchData, 30000) // Auto-refresh every 30 seconds
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total OLTs"
                    value={stats.total_olts}
                    icon={<ApiOutlined />}
                    color="#3B82F6"
                    subtitle={`${stats.online_olts} online`}
                />
                <StatsCard
                    title="Total ONUs"
                    value={stats.total_onus}
                    icon={<WifiOutlined />}
                    color="#10B981"
                    subtitle={`${stats.online_onus} online`}
                />
                <StatsCard
                    title="Active Alarms"
                    value={stats.active_alarms}
                    icon={<AlertOutlined />}
                    color="#EF4444"
                    subtitle={`${stats.critical_alarms} critical`}
                />
                <StatsCard
                    title="Network Health"
                    value={Math.round((stats.online_olts / stats.total_olts) * 100) || 0}
                    icon={<CheckCircleOutlined />}
                    color="#8B5CF6"
                    subtitle="OLT uptime"
                />
            </div>

            {/* Recent Alarms */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Alarms</h3>
                <div className="space-y-3">
                    {recentAlarms.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No recent alarms</p>
                    ) : (
                        recentAlarms.map((alarm) => (
                            <AlarmCard key={alarm.id} alarm={alarm} />
                        ))
                    )}
                </div>
            </div>

            {/* OLT Performance */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">OLT Performance</h3>
                <div className="space-y-4">
                    {oltPerformance.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No OLT performance data</p>
                    ) : (
                        oltPerformance.map((olt) => (
                            <div key={olt.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900">{olt.name}</h4>
                                    <StatusBadge status={olt.status} size="sm" />
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">CPU:</span>
                                        <span className="ml-2 font-medium">{olt.cpu_usage}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Memory:</span>
                                        <span className="ml-2 font-medium">{olt.memory_usage}%</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Temperature:</span>
                                        <span className="ml-2 font-medium">{olt.temperature}°C</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
