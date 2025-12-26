/**
 * File: components/layout/DashboardLayout.tsx
 * 
 * Layout component untuk halaman dashboard NMS ZTE OLT
 * Menyediakan sidebar navigasi, header, dan struktur layout utama
 * 
 * Alasan desain:
 * - Menggunakan Ant Design Layout untuk struktur enterprise yang profesional
 * - Sidebar yang collapsible dengan animasi smooth menggunakan React Bits
 * - Header dengan user info dan notifikasi yang responsif
 * - Navigasi yang konsisten dengan pola nms.zetset.id
 * - Dark theme untuk sidebar dengan kontras yang nyaman di mata
 * 
 * Integrasi dengan backend:
 * - User data dari localStorage setelah login
 * - Logout API call untuk membersihkan session
 * - Token management untuk autentikasi
 * 
 * Fungsi:
 * - Menampilkan sidebar dengan menu navigasi lengkap
 * - Menampilkan header dengan informasi user, notifikasi, dan settings
 * - Menyediakan area konten utama untuk halaman dashboard
 * - Handle logout dan session management
 * - Responsive design untuk desktop dan tablet
 * 
 * Props:
 * - children: React node yang akan dirender di area konten
 */

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Layout, Button, Typography, Space, Tooltip } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '../../services/api'
import type { User } from '../../types'
import Sidebar from './Sidebar'
import Header from './Header'

const { Content } = Layout
const { Text } = Typography

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
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar Navigation */}
            <Sidebar
                open={sidebarOpen}
                activeTab={activeTab}
                user={user}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onNavigate={navigate}
            />

            {/* Main Content Area */}
            <Layout style={{ marginLeft: sidebarOpen ? 240 : 80, transition: 'all 0.2s' }}>
                {/* Top Header */}
                <Header
                    activeTab={activeTab}
                    user={user}
                    onLogout={handleLogout}
                />

                {/* Main Content */}
                <Content className="p-6 bg-gray-50">
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}
