/** AUTO-DOC: src/components/StatusBadge.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/StatusBadge.tsx
 *
 * Komponen `StatusBadge` digunakan untuk menampilkan status perangkat
 * (online, offline, warning, critical) secara konsisten di seluruh UI.
 *
 * Alasan desain:
 * - Menggunakan Ant Design Badge untuk tampilan enterprise yang profesional
 * - Warna dan label mengikuti standar Ant Design untuk konsistensi visual
 * - Mendukung multiple size dan variant untuk fleksibilitas penggunaan
 * - Menggunakan React Bits untuk animasi ringan saat status berubah
 * - Menyediakan aksesibilitas dengan proper aria-label dan tooltip
 *
 * Integrasi dengan backend:
 * - Status value berasal dari API response (OLT/ONU status, alarm status)
 * - Mapping status ke visual style dilakukan di frontend untuk konsistensi
 *
 * Cara penggunaan:
 * <StatusBadge status="online" />
 * <StatusBadge status="offline" size="sm" variant="badge" />
 * <StatusBadge status="warning" showDot={true} />
 *
 * Props:
 * - status: 'online' | 'offline' | 'warning' | 'critical' | 'active' | 'acknowledged' | 'cleared' | 'unknown'
 * - size: 'sm' | 'md' | 'lg' (opsional, default 'md')
 * - variant: 'badge' | 'tag' | 'ribbon' (opsional, default 'badge')
 * - showDot: boolean (opsional, default false)
 */

import { Badge, Tag } from 'antd'
import { motion } from 'framer-motion'
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, WarningOutlined, QuestionCircleOutlined } from '@ant-design/icons'

interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'badge' | 'tag' | 'ribbon'
    showDot?: boolean
    className?: string
}

export default function StatusBadge({
    status,
    size = 'md',
    variant = 'badge',
    showDot = false,
    className = ''
}: StatusBadgeProps) {
    const normalized = (status || '').toLowerCase()

    // Mapping status ke konfigurasi Ant Design
    const statusConfig = {
        online: {
            color: 'success',
            label: 'Online',
            icon: <CheckCircleOutlined />,
            antColor: '#52c41a'
        },
        offline: {
            color: 'error',
            label: 'Offline',
            icon: <CloseCircleOutlined />,
            antColor: '#ff4d4f'
        },
        warning: {
            color: 'warning',
            label: 'Warning',
            icon: <ExclamationCircleOutlined />,
            antColor: '#faad14'
        },
        critical: {
            color: 'error',
            label: 'Critical',
            icon: <WarningOutlined />,
            antColor: '#ff4d4f'
        },
        active: {
            color: 'error',
            label: 'Active',
            icon: <ExclamationCircleOutlined />,
            antColor: '#ff4d4f'
        },
        acknowledged: {
            color: 'warning',
            label: 'Acknowledged',
            icon: <ExclamationCircleOutlined />,
            antColor: '#faad14'
        },
        cleared: {
            color: 'success',
            label: 'Cleared',
            icon: <CheckCircleOutlined />,
            antColor: '#52c41a'
        },
        unknown: {
            color: 'default',
            label: 'Unknown',
            icon: <QuestionCircleOutlined />,
            antColor: '#d9d9d9'
        }
    }

    const config = statusConfig[normalized as keyof typeof statusConfig] || statusConfig.unknown

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
            style: sizeConfig[size],
            className: className,
            "aria-label": `status-${normalized}`,
            title: config.label
        }

        switch (variant) {
            case 'tag':
                return (
                    <motion.div {...motionProps}>
                        <Tag
                            color={config.color}
                            icon={showDot ? config.icon : undefined}
                            {...commonProps}
                        >
                            {config.label}
                        </Tag>
                    </motion.div>
                )


            case 'ribbon':
                // AntD v6 removed Ribbon; fallback to Tag styled as ribbon
                return (
                    <motion.div {...motionProps}>
                        <Tag
                            color={config.color}
                            {...commonProps}
                            style={{ padding: '4px 8px', borderRadius: 6 }}
                        >
                            {config.label}
                        </Tag>
                    </motion.div>
                )

            case 'badge':
            default:
                return (
                    <motion.div {...motionProps}>
                        <Badge
                            status={config.color as any}
                            text={config.label}
                            {...commonProps}
                        />
                    </motion.div>
                )
        }
    }

    return renderBadge()
}
