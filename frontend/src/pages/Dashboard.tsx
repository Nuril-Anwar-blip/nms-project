/** AUTO-DOC: src/pages/Dashboard.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/Dashboard.tsx
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
import { getDashboardStats, getOltPerformance, getRecentAlarms } from '../services/api'
import type { DashboardStats, OltPerformance, Alarm } from '../types'
import StatsCard from '../components/cards/StatsCard'
import AlarmCard from '../components/cards/AlarmCard'
import StatusBadge from '../components/status/StatusBadge'
import SeverityBadge from '../components/status/SeverityBadge'
import {
  ApiOutlined,
  WifiOutlined,
  AlertOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

export default function Dashboard() {
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

  /**
   * Fetch data dashboard dari API
   * Dipanggil saat component mount dan setiap 30 detik
   */
  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh setiap 30 detik
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsData, performanceData, alarmsData] = await Promise.all([
        getDashboardStats(),
        getOltPerformance(),
        getRecentAlarms(5)
      ])

      setStats(statsData)
      setOltPerformance(performanceData)
      setRecentAlarms(Array.isArray(alarmsData) ? alarmsData : [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              🔌
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">{stats.total_olts}</div>
              <div className="text-sm text-gray-500">Total OLTs</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-blue-50 rounded-lg text-center">
              <div className="font-bold text-gray-900">{stats.online_olts}</div>
              <div className="text-xs text-gray-600">Online</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <div className="font-bold text-gray-900">{stats.offline_olts}</div>
              <div className="text-xs text-gray-600">Offline</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              📡
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">{stats.total_onus}</div>
              <div className="text-sm text-gray-500">Total ONUs</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-purple-50 rounded-lg text-center">
              <div className="font-bold text-gray-900">{stats.online_onus}</div>
              <div className="text-xs text-gray-600">Online</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <div className="font-bold text-gray-900">{stats.offline_onus}</div>
              <div className="text-xs text-gray-600">Offline</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center">
              🚨
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">{stats.active_alarms}</div>
              <div className="text-sm text-gray-500">Active Alarms</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-red-50 rounded-lg text-center">
              <div className="font-bold text-gray-900">{stats.critical_alarms}</div>
              <div className="text-xs text-gray-600">Critical</div>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-center">
              <div className="font-bold text-gray-900">{stats.major_alarms}</div>
              <div className="text-xs text-gray-600">Major</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              📈
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">
                {stats.total_olts > 0 ? Math.round((stats.online_olts / stats.total_olts) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Network Health</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 rounded-full h-2 transition-all"
                style={{ width: `${stats.total_olts > 0 ? (stats.online_olts / stats.total_olts) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alarms */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Recent Alarms</h3>
          </div>
          <div className="divide-y">
            {recentAlarms.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-600 font-medium">No active alarms</p>
                <p className="text-sm text-gray-500 mt-2">All systems operational</p>
              </div>
            ) : (
              recentAlarms.map((alarm) => (
                <div key={alarm.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${alarm.severity === 'critical' ? 'bg-red-100' :
                      alarm.severity === 'major' ? 'bg-orange-100' :
                        'bg-yellow-100'
                      }`}>
                      <span className="text-2xl">
                        {alarm.severity === 'critical' ? '🔴' : alarm.severity === 'major' ? '🟠' : '🟡'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <SeverityBadge value={alarm.severity} kind="severity" size="sm" />
                        <span className="font-semibold text-gray-900">{alarm.type}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alarm.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{new Date(alarm.occurred_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats & OLT Performance */}
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
                    <p className="text-lg font-bold text-gray-900">{stats.online_olts}</p>
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
                    <p className="text-lg font-bold text-gray-900">{stats.online_onus}</p>
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
                    <p className="text-lg font-bold text-gray-900">{stats.critical_alarms}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OLT Performance */}
          {oltPerformance.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">OLT Performance</h3>
              <div className="space-y-3">
                {oltPerformance.slice(0, 3).map((olt) => (
                  <div key={olt.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{olt.name}</span>
                      <StatusBadge status={olt.status} size="sm" />
                    </div>
                    {olt.cpu_usage != null && (
                      <div className="text-xs text-gray-600">
                        CPU: {olt.cpu_usage.toFixed(1)}% | Memory: {olt.memory_usage != null ? olt.memory_usage.toFixed(1) : 'N/A'}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

