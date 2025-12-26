/**
 * File: components/buttons/SecondaryButton.tsx
 * 
 * Komponen Secondary Button untuk aksi sekunder di NMS
 * Digunakan untuk aksi yang kurang penting seperti cancel, reset, dll
 */

import { Button } from 'antd'
import { motion } from 'framer-motion'

interface SecondaryButtonProps {
    children: React.ReactNode
    onClick?: () => void
    size?: 'small' | 'middle' | 'large'
    loading?: boolean
    disabled?: boolean
    icon?: React.ReactNode
    className?: string
}

export default function SecondaryButton({
    children,
    onClick,
    size = 'middle',
    loading = false,
    disabled = false,
    icon,
    className = ''
}: SecondaryButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
        >
            <Button
                type="default"
                size={size}
                loading={loading}
                disabled={disabled}
                icon={icon}
                onClick={onClick}
                className={className}
                style={{
                    borderRadius: '8px',
                    fontWeight: 500,
                    borderColor: '#d9d9d9'
                }}
            >
                {children}
            </Button>
        </motion.div>
    )
}
