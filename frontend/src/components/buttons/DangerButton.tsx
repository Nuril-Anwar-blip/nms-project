/**
 * File: components/buttons/DangerButton.tsx
 * 
 * Komponen Danger Button untuk aksi berbahaya di NMS
 * Digunakan untuk aksi seperti delete, remove, clear, dll
 */

import { Button } from 'antd'
import { motion } from 'framer-motion'

interface DangerButtonProps {
    children: React.ReactNode
    onClick?: () => void
    size?: 'small' | 'middle' | 'large'
    loading?: boolean
    disabled?: boolean
    icon?: React.ReactNode
    className?: string
}

export default function DangerButton({
    children,
    onClick,
    size = 'middle',
    loading = false,
    disabled = false,
    icon,
    className = ''
}: DangerButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
        >
            <Button
                danger
                size={size}
                loading={loading}
                disabled={disabled}
                icon={icon}
                onClick={onClick}
                className={className}
                style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    borderColor: '#ff4d4f'
                }}
            >
                {children}
            </Button>
        </motion.div>
    )
}
