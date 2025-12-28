/** AUTO-DOC: src/components/status/SeverityBadge.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/status/SeverityBadge.tsx
 *
 * Komponen `SeverityBadge` menampilkan tingkat severity atau tipe activity 
 * dengan menggunakan Ant Design untuk tampilan enterprise yang profesional.
 *
 * Alasan desain:
 * - Menggunakan Ant Design Tag dan Badge untuk konsistensi visual enterprise
 * - Warna mengikuti standar Ant Design untuk severity levels
 * - Mendukung animasi ringan dengan React Bits (Framer Motion)
 * - Fleksibel untuk berbagai konteks: alarm, activity log, monitoring
 * - Aksesibel dengan proper aria-label dan tooltip
 *
 * Integrasi dengan backend:
 * - Severity value berasal dari API response (alarm severity, activity types)
 * - Mapping ke visual style dilakukan di frontend untuk konsistensi
 *
 * Cara penggunaan:
 * <SeverityBadge value="critical" />
 * <SeverityBadge value="create" kind="activity" />
 * <SeverityBadge value="major" kind="severity" variant="tag" />
 *
 * Props:
 * - value: nilai severity/activity (string)
 * - kind: 'severity' | 'activity' (default 'severity')
 * - size: 'sm' | 'md' | 'lg' (default 'md')
 * - variant: 'tag' | 'badge' (default 'tag')
 * - showIcon: boolean (default false)
 */

import { Tag, Badge } from 'antd'
import { motion } from 'framer-motion'
import {
    ExclamationCircleFilled,
    WarningFilled,
    InfoCircleFilled,
    PlusCircleFilled,
    EditFilled,
    DeleteFilled,
    ToolFilled,
    ReloadOutlined,
    SyncOutlined,
    LoginOutlined,
    LogoutOutlined
} from '@ant-design/icons'

interface Props {
    value: string
    kind?: 'severity' | 'activity'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'tag' | 'badge'
    showIcon?: boolean
    className?: string
}

export default function SeverityBadge({
    value,
    kind = 'severity',
    size = 'md',
    variant = 'tag',
    showIcon = false,
    className = ''
}: Props) {
    const v = (value || '').toLowerCase()

    // Mapping severity ke konfigurasi Ant Design
    const severityConfig = {
        critical: {
            color: 'error',
            label: 'CRITICAL',
            icon: <ExclamationCircleFilled />
        },
        major: {
            color: 'warning',
            label: 'MAJOR',
            icon: <WarningFilled />
        },
        minor: {
            color: 'warning',
            label: 'MINOR',
            icon: <WarningFilled />
        },
        warning: {
            color: 'warning',
            label: 'WARNING',
            icon: <WarningFilled />
        },
        info: {
            color: 'info',
            label: 'INFO',
            icon: <InfoCircleFilled />
        }
    }

    // Mapping activity ke konfigurasi Ant Design
    const activityConfig = {
        create: {
            color: 'success',
            label: 'CREATE',
            icon: <PlusCircleFilled />
        },
        update: {
            color: 'processing',
            label: 'UPDATE',
            icon: <EditFilled />
        },
        delete: {
            color: 'error',
            label: 'DELETE',
            icon: <DeleteFilled />
        },
        provision: {
            color: 'purple',
            label: 'PROVISION',
            icon: <ToolFilled />
        },
        reboot: {
            color: 'warning',
            label: 'REBOOT',
            icon: <ReloadOutlined />
        },
        reset: {
            color: 'orange',
            label: 'RESET',
            icon: <SyncOutlined />
        },
        login: {
            color: 'geekblue',
            label: 'LOGIN',
            icon: <LoginOutlined />
        },
        logout: {
            color: 'default',
            label: 'LOGOUT',
            icon: <LogoutOutlined />
        }
    }

    const config = kind === 'activity'
        ? activityConfig[v as keyof typeof activityConfig] || { color: 'default', label: value?.toUpperCase() || 'UNKNOWN', icon: <InfoCircleFilled /> }
        : severityConfig[v as keyof typeof severityConfig] || { color: 'default', label: value?.toUpperCase() || 'UNKNOWN', icon: <InfoCircleFilled /> }

    // Size mapping untuk Ant Design
    const sizeConfig = {
        sm: { fontSize: '12px', padding: '2px 6px' },
        md: { fontSize: '14px', padding: '4px 8px' },
        lg: { fontSize: '16px', padding: '6px 12px' }
    }

    // Animasi dengan React Bits (Framer Motion)
    const motionProps = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.2 }
    }

    // Render berdasarkan variant
    const renderBadge = () => {
        const commonProps = {
            style: { ...sizeConfig[size] },
            className: className,
            "aria-label": `${kind}-${v}`,
            title: config.label
        }

        switch (variant) {
            case 'badge':
                return (
                    <motion.div {...motionProps}>
                        <Badge
                            status={config.color as any}
                            text={config.label}
                            {...commonProps}
                        />
                    </motion.div>
                )

            case 'tag':
            default:
                return (
                    <motion.div {...motionProps}>
                        <Tag
                            color={config.color}
                            icon={showIcon ? config.icon : undefined}
                            {...commonProps}
                        >
                            {config.label}
                        </Tag>
                    </motion.div>
                )
        }
    }

    return renderBadge()
}
