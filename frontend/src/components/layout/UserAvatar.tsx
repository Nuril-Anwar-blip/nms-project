/**
 * File: components/layout/UserAvatar.tsx
 * 
 * Komponen UserAvatar untuk menampilkan informasi user di layout
 * 
 * Props:
 * - user: User | null - data user yang sedang login
 * - showName?: boolean - apakah menampilkan nama user
 * - size?: 'small' | 'default' | 'large' - ukuran avatar
 */

import { Avatar, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import type { User } from '../../types'

const { Text } = Typography

interface UserAvatarProps {
    user: User | null
    showName?: boolean
    size?: 'small' | 'default' | 'large'
}

export default function UserAvatar({ user, showName = true, size = 'default' }: UserAvatarProps) {
    const avatarSize = size === 'small' ? 24 : size === 'large' ? 40 : 32

    return (
        <div className="flex items-center space-x-3">
            <Avatar
                size={avatarSize}
                className="bg-gradient-to-br from-blue-500 to-indigo-600"
                icon={!user && <UserOutlined />}
            >
                {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            {showName && user && (
                <div className="min-w-0">
                    <Text className="text-sm font-medium text-gray-900 block truncate">
                        {user.name}
                    </Text>
                    <Text className="text-xs text-gray-500 block truncate">
                        {user.email}
                    </Text>
                </div>
            )}
        </div>
    )
}
