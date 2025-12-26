/**
 * File: components/buttons/PrimaryButton.tsx
 * 
 * Komponen Primary Button untuk aksi utama di NMS
 * Digunakan untuk aksi yang paling penting seperti submit, save, dll
 */

import { Button } from 'antd'
import { motion } from 'framer-motion'

interface PrimaryButtonProps {
    children: React.ReactNode
    onClick?: () => void
    size?: 'small' | 'middle' | 'large'
    loading?: boolean
    disabled?: boolean
    icon?: React.ReactNode
    className?: string
}

export default function PrimaryButton({
    children,
    onClick,
    size = 'middle',
    loading = false,
    disabled = false,
    icon,
    className = ''
}: PrimaryButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
        >
            <Button
                type="primary"
                size={size}
                loading={loading}
                disabled={disabled}
                icon={icon}
                onClick={onClick}
                className={className}
                style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            >
                {children}
            </Button>
        </motion.div>
    )
}
