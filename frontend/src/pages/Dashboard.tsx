/**
 * File: pages/Dashboard.tsx
 * Deskripsi: Halaman Dashboard utama aplikasi NMS dengan animasi dan koneksi database lengkap
 * 
 * Fitur:
 * - Statistik real-time dari database: Total OLT, ONU, Alarms
 * - Performa OLT: CPU, Memory, Temperature dari database
 * - Alarm terbaru dari database
 * - Auto-refresh setiap 30 detik
 * - Animasi CountUp untuk statistik
 * - Loading states
 * - Error handling
 * 
 * Data yang ditampilkan (semua dari database):
 * - Statistik OLT (total, online, offline)
 * - Statistik ONU (total, online, offline)
 * - Statistik Alarm (total, critical, major, minor)
 * - Network Health percentage
 * - Recent alarms list
 * - OLT performance metrics
 * 
 * API Endpoints yang digunakan:
 * - GET /api/dashboard/stats - Statistik dashboard
 * - GET /api/dashboard/olt-performance - Performa OLT
 * - GET /api/dashboard/recent-alarms - Alarm terbaru
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats, getOltPerformance, getRecentAlarms } from '../services/api'
import type { DashboardStats, OltPerformance, Alarm } from '../types'
import CountUp from '../components/animations/CountUp'
import BlurText from '../components/animations/BlurText'
import StatusBadge from '../components/status/StatusBadge'
import SeverityBadge from '../components/status/SeverityBadge'
import { colors } from '../lib/colors'
import {
  ApiOutlined,
  WifiOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  RightOutlined
} from '@ant-design/icons'

export default function Dashboard() {
  // State untuk data dashboard dari database
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
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  /**
   * Fungsi: fetchDashboardData
   * Mengambil semua data dashboard dari database melalui API
   * Dipanggil saat component mount dan setiap 30 detik
   */
  const fetchDashboardData = async () => {
    try {
      setError(null)
      // Mengambil semua data secara parallel untuk performa lebih baik
      const [statsData, performanceData, alarmsData] = await Promise.all([
        getDashboardStats(),
        getOltPerformance(),
        getRecentAlarms(5)
      ])

      // Update state dengan data dari database
      setStats(statsData)
      setOltPerformance(performanceData || [])
      setRecentAlarms(Array.isArray(alarmsData) ? alarmsData : [])
      setLastUpdate(new Date())
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Gagal memuat data dashboard. Pastikan koneksi ke server berjalan dengan baik.')
      setLoading(false)
    }
  }

  /**
   * Effect: Fetch data saat component mount dan setup auto-refresh
   * Auto-refresh setiap 30 detik untuk data real-time
   */
  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh setiap 30 detik
    return () => clearInterval(interval)
  }, [])

  /**
   * Handler: handleRefresh
   * Manual refresh untuk update data dashboard
   */
  const handleRefresh = () => {
    setLoading(true)
    fetchDashboardData()
  }

  // Loading state
  if (loading && stats.total_olts === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  // Calculate network health percentage
  const networkHealth = stats.total_olts > 0 
    ? Math.round((stats.online_olts / stats.total_olts) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Header dengan refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Terakhir diperbarui: {lastUpdate.toLocaleTimeString('id-ID')}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <ReloadOutlined className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards dengan CountUp animasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total OLTs Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <ApiOutlined className="text-2xl" />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                <CountUp to={stats.total_olts} from={0} duration={2} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total OLTs</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                <CountUp to={stats.online_olts} from={0} duration={2} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Online</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                <CountUp to={stats.offline_olts} from={0} duration={2} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Offline</div>
            </div>
          </div>
        </div>

        {/* Total ONUs Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <WifiOutlined className="text-2xl" />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                <CountUp to={stats.total_onus} from={0} duration={2} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total ONUs</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                <CountUp to={stats.online_onus} from={0} duration={2} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Online</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                <CountUp to={stats.offline_onus} from={0} duration={2} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Offline</div>
            </div>
          </div>
        </div>

        {/* Active Alarms Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <AlertOutlined className="text-2xl" />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                <CountUp to={stats.active_alarms} from={0} duration={2} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active Alarms</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <div className="font-bold text-red-600 dark:text-red-400">
                <CountUp to={stats.critical_alarms} from={0} duration={2} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
              <div className="font-bold text-orange-600 dark:text-orange-400">
                <CountUp to={stats.major_alarms} from={0} duration={2} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Major</div>
            </div>
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <div className="font-bold text-yellow-600 dark:text-yellow-400">
                <CountUp to={stats.minor_alarms} from={0} duration={2} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Minor</div>
            </div>
          </div>
        </div>

        {/* Network Health Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircleOutlined className="text-2xl" />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                <CountUp to={networkHealth} from={0} duration={2} />%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Network Health</div>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-emerald-600 rounded-full h-3 transition-all duration-500"
                style={{ width: `${networkHealth}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats.online_olts} dari {stats.total_olts} OLT online
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alarms */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              <BlurText
                text="Recent Alarms"
                animateBy="words"
                direction="top"
                delay={50}
              />
            </h3>
            <Link 
              to="/dashboard/alarms" 
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              Lihat semua <RightOutlined />
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentAlarms.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Tidak ada alarm aktif</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Semua sistem berjalan normal</p>
              </div>
            ) : (
              recentAlarms.map((alarm) => (
                <div key={alarm.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                      alarm.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
                      alarm.severity === 'major' ? 'bg-orange-100 dark:bg-orange-900/20' :
                      'bg-yellow-100 dark:bg-yellow-900/20'
                    }`}>
                      <AlertOutlined className={`text-2xl ${
                        alarm.severity === 'critical' ? 'text-red-600' :
                        alarm.severity === 'major' ? 'text-orange-600' :
                        'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <SeverityBadge value={alarm.severity} kind="severity" size="sm" />
                        <span className="font-semibold text-gray-900 dark:text-white">{alarm.type}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{alarm.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(alarm.occurred_at).toLocaleString('id-ID')}</span>
                        {alarm.olt_name && (
                          <span>OLT: {alarm.olt_name}</span>
                        )}
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <Link to="/dashboard/olts" className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <ApiOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">OLTs Online</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.online_olts}</p>
                  </div>
                </div>
                <RightOutlined className="text-gray-400" />
              </Link>
              <Link to="/dashboard/onus" className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    <WifiOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ONUs Online</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.online_onus}</p>
                  </div>
                </div>
                <RightOutlined className="text-gray-400" />
              </Link>
              <Link to="/dashboard/alarms" className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                    <AlertOutlined />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Critical Alarms</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.critical_alarms}</p>
                  </div>
                </div>
                <RightOutlined className="text-gray-400" />
              </Link>
            </div>
          </div>

          {/* OLT Performance */}
          {oltPerformance.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">OLT Performance</h3>
                <Link 
                  to="/dashboard/olts" 
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Lihat semua
                </Link>
              </div>
              <div className="space-y-3">
                {oltPerformance.slice(0, 3).map((olt) => (
                  <div key={olt.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{olt.name}</span>
                      <StatusBadge status={olt.status} size="sm" />
                    </div>
                    {olt.cpu_usage != null && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div>CPU: {olt.cpu_usage.toFixed(1)}%</div>
                        {olt.memory_usage != null && (
                          <div>Memory: {olt.memory_usage.toFixed(1)}%</div>
                        )}
                        {olt.temperature != null && (
                          <div>Temp: {olt.temperature}°C</div>
                        )}
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
