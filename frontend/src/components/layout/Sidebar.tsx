/**
 * File: components/layout/Sidebar.tsx
 * 
 * Komponen Sidebar untuk navigasi utama dashboard NMS ZTE OLT
 * 
 * Alasan desain:
 * - Menggunakan Ant Design Layout Sider untuk struktur yang konsisten
 * - Menu items dengan icon yang sesuai untuk setiap fitur NMS
 * - Animasi smooth saat collapse/expand dengan React Bits
 * - Dark theme untuk kontras yang nyaman di mata operator
 * - User info display untuk identifikasi operator
 * 
 * Integrasi dengan backend:
 * - User data dari props (diambil dari localStorage)
 * - Navigation handler untuk routing
 * 
 * Cara penggunaan:
 * <Sidebar
 *   open={sidebarOpen}
 *   activeTab="dashboard"
 *   user={userData}
 *   onToggle={handleToggle}
 *   onNavigate={navigate}
 * />
 *
 * Props:
 * - open: boolean - status sidebar terbuka/tutup
 * - activeTab: string - menu item yang sedang aktif
 * - user: User | null - data user yang sedang login
 * - onToggle: function - handler untuk toggle sidebar
 * - onNavigate: function - handler untuk navigasi
 */

import { Menu, Button, Typography } from 'antd'
import {
    DashboardOutlined,
    MonitorOutlined,
    ApiOutlined,
    WifiOutlined,
    SettingOutlined,
    AlertOutlined,
    FileTextOutlined,
    EnvironmentOutlined,
    LinkOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '../../types'
import UserAvatar from './UserAvatar'

const { Title, Text } = Typography

interface SidebarProps {
    open: boolean
    activeTab: string
    user: User | null
    onToggle: () => void
    onNavigate: (path: string) => void
}

export default function Sidebar({ open, activeTab, user, onToggle, onNavigate }: SidebarProps) {
    /**
     * Menu items untuk sidebar navigasi dengan icon Ant Design
     */
    const menuItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: <DashboardOutlined />,
            path: '/dashboard'
        },
        {
            key: 'monitoring',
            label: 'Monitoring',
            icon: <MonitorOutlined />,
            path: '/dashboard/monitoring'
        },
        {
            key: 'olts',
            label: 'OLTs',
            icon: <ApiOutlined />,
            path: '/dashboard/olts'
        },
        {
            key: 'onus',
            label: 'ONUs',
            icon: <WifiOutlined />,
            path: '/dashboard/onus'
        },
        {
            key: 'provisioning',
            label: 'Provisioning',
            icon: <SettingOutlined />,
            path: '/dashboard/provisioning'
        },
        {
            key: 'alarms',
            label: 'Alarms',
            icon: <AlertOutlined />,
            path: '/dashboard/alarms'
        },
        {
            key: 'activity-logs',
            label: 'Activity Logs',
            icon: <FileTextOutlined />,
            path: '/dashboard/activity-logs'
        },
        {
            key: 'maps',
            label: 'Maps',
            icon: <EnvironmentOutlined />,
            path: '/dashboard/maps'
        },
        {
            key: 'client-api',
            label: 'Client API',
            icon: <LinkOutlined />,
            path: '/dashboard/client-api'
        }
    ]

    return (
        <div
            className="bg-gray-900 shadow-xl"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: open ? 240 : 80,
                transition: 'width 0.2s',
                zIndex: 40
            }}
        >
            {/* Logo/Brand */}
            <div className="p-6 border-b border-gray-700">
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Title level={4} className="text-white mb-1 !text-lg">
                                NMS ZTE OLT
                            </Title>
                            <Text className="text-gray-300 text-xs">Network Management</Text>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="text-center"
                        >
                            <ApiOutlined className="text-3xl text-blue-400" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* User Info */}
            {open && user && (
                <div className="p-4 border-b border-gray-700">
                    <UserAvatar user={user} showName={true} size="small" />
                </div>
            )}

            {/* Navigation Menu */}
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[activeTab]}
                items={menuItems}
                className="bg-gray-900 border-none"
                onClick={({ key }) => {
                    const item = menuItems.find(m => m.key === key)
                    if (item) onNavigate(item.path)
                }}
                style={{ borderRight: 0 }}
            />

            {/* Bottom Section - Toggle Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                <Button
                    type="text"
                    icon={open ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={onToggle}
                    className="w-full text-gray-400 hover:text-white hover:bg-gray-700"
                    style={{ border: 'none' }}
                />
            </div>
        </div>
    )
}
