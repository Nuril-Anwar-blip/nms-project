/**
 * File: components/DashboardLayout.tsx
 * 
 * Layout component untuk halaman dashboard
 * Menyediakan sidebar navigasi, header, dan struktur layout utama
 * 
 * Fungsi:
 * - Menampilkan sidebar dengan menu navigasi
 * - Menampilkan header dengan informasi user dan notifikasi
 * - Menyediakan area konten untuk halaman dashboard
 * - Handle logout user
 * 
 * Props:
 * - children: React node yang akan dirender di area konten
 * 
 * Menu items:
 * - Dashboard: Halaman utama dengan statistik
 * - Monitoring: Monitoring real-time OLT dan ONU
 * - OLTs: Manajemen OLT
 * - ONUs: Manajemen ONU
 * - Provisioning: Provisioning ONU baru
 * - Alarms: Manajemen alarm
 * - Activity Logs: Log aktivitas operator
 * - Maps: Peta geografis OLT/ONU
 * - Client API: Dokumentasi API
 */

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../services/api'
import type { User } from '../types'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user data dari localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
  }, [])

  /**
   * Menentukan tab aktif berdasarkan pathname
   */
  const getActiveTab = (): string => {
    const path = location.pathname
    if (path.includes('/monitoring')) return 'monitoring'
    if (path.includes('/olts')) return 'olts'
    if (path.includes('/onus')) return 'onus'
    if (path.includes('/provisioning')) return 'provisioning'
    if (path.includes('/alarms')) return 'alarms'
    if (path.includes('/activity-logs')) return 'activity-logs'
    if (path.includes('/maps')) return 'maps'
    if (path.includes('/client-api')) return 'client-api'
    return 'dashboard'
  }

  const activeTab = getActiveTab()

  /**
   * Menu items untuk sidebar navigasi
   */
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'monitoring', label: 'Monitoring', icon: '📈', path: '/dashboard/monitoring' },
    { id: 'olts', label: 'OLTs', icon: '🔌', path: '/dashboard/olts' },
    { id: 'onus', label: 'ONUs', icon: '📡', path: '/dashboard/onus' },
    { id: 'provisioning', label: 'Provisioning', icon: '⚙️', path: '/dashboard/provisioning' },
    { id: 'alarms', label: 'Alarms', icon: '🚨', path: '/dashboard/alarms' },
    { id: 'activity-logs', label: 'Activity Logs', icon: '📋', path: '/dashboard/activity-logs' },
    { id: 'maps', label: 'Maps', icon: '🗺️', path: '/dashboard/maps' },
    { id: 'client-api', label: 'Client API', icon: '🔗', path: '/dashboard/client-api' },
  ]

  /**
   * Handle logout user
   * Memanggil API logout dan menghapus token dari localStorage
   */
  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 fixed left-0 top-0 h-full z-40 shadow-2xl`}>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700">
          {sidebarOpen ? (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                NMS ZTE OLT
              </h1>
              <p className="text-xs text-gray-400 mt-1">Network Management</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-3xl">📡</div>
            </div>
          )}
        </div>

        {/* User Info */}
        {sidebarOpen && user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email || 'user@example.com'}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom Section - Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full mt-2 p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30 border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-xl">🔔</span>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {/* Settings */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-xl">⚙️</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

