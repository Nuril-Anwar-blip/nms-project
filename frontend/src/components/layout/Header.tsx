/**
 * File: components/layout/Header.tsx
 * 
 * Komponen Header untuk dashboard NMS ZTE OLT
 * 
 * Alasan desain:
 * - Menggunakan Ant Design Layout Header untuk struktur yang konsisten
 * - Menampilkan informasi halaman aktif dan tanggal
 * - User dropdown dengan profile dan logout
 * - Notifikasi badge untuk alarm dan alerts
 * - Settings button untuk konfigurasi sistem
 * - Responsive design untuk desktop dan tablet
 * 
 * Integrasi dengan backend:
 * - User data dari props (diambil dari localStorage)
 * - Logout handler untuk session management
 * - Active tab dari routing untuk menampilkan judul halaman
 * 
 * Cara penggunaan:
 * <Header
 *   activeTab="dashboard"
 *   user={userData}
 *   onLogout={handleLogout}
 * />
 *
 * Props:
 * - activeTab: string - menu item yang sedang aktif
 * - user: User | null - data user yang sedang login
 * - onLogout: function - handler untuk logout
 */

import { Badge, Button, Typography, Space, Tooltip, Dropdown } from 'antd'
import {
    BellOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import type { User } from '../../types'
import UserAvatar from './UserAvatar'

const { Title, Text } = Typography

interface HeaderProps {
    activeTab: string
    user: User | null
    onLogout: () => void
}

export default function Header({ activeTab, user, onLogout }: HeaderProps) {
    /**
     * Menu items untuk user dropdown
     */
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => {
                // Navigate to profile page
                console.log('Navigate to profile')
            }
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => {
                // Navigate to settings page
                console.log('Navigate to settings')
            }
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: onLogout,
            danger: true
        }
    ]

    /**
     * Mapping active tab ke label yang akan ditampilkan
     */
    const getTabLabel = (tab: string): string => {
        const labels: Record<string, string> = {
            dashboard: 'Dashboard',
            monitoring: 'Monitoring',
            olts: 'OLTs',
            onus: 'ONUs',
            provisioning: 'Provisioning',
            alarms: 'Alarms',
            'activity-logs': 'Activity Logs',
            maps: 'Maps',
            'client-api': 'Client API'
        }
        return labels[tab] || 'Dashboard'
    }

    return (
        <div className="bg-white shadow-sm sticky top-0 z-30 px-6 flex items-center justify-between border-b">
            {/* Page Title and Date */}
            <div>
                <Title level={3} className="!mb-0 text-gray-900">
                    {getTabLabel(activeTab)}
                </Title>
                <Text className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            </div>

            {/* Right Section - Notifications, Settings, User */}
            <Space size="middle">
                {/* Notifications */}
                <Tooltip title="Notifications">
                    <Badge count={5} size="small">
                        <Button
                            type="text"
                            icon={<BellOutlined />}
                            className="text-gray-600 hover:text-gray-900"
                        />
                    </Badge>
                </Tooltip>

                {/* Settings */}
                <Tooltip title="Settings">
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => {
                            // Navigate to settings
                            console.log('Navigate to settings')
                        }}
                    />
                </Tooltip>

                {/* User Dropdown */}
                <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                >
                    <Space className="cursor-pointer">
                        <UserAvatar user={user} showName={false} size="small" />
                        <Text className="text-sm text-gray-700 hidden sm:block">
                            {user?.name || 'User'}
                        </Text>
                    </Space>
                </Dropdown>
            </Space>
        </div>
    )
}
