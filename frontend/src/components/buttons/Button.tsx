import { Button } from 'antd'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface BaseButtonProps {
    children: ReactNode
    onClick?: () => void
    size?: 'small' | 'middle' | 'large'
    loading?: boolean
    disabled?: boolean
    icon?: ReactNode
    variant?: ButtonVariant
    className?: string
}

export default function BaseButton({
    children,
    onClick,
    size = 'middle',
    loading = false,
    disabled = false,
    icon,
    variant = 'primary',
    className = ''
}: BaseButtonProps) {
    const variantProps = {
        primary: {
            type: 'primary' as const,
            danger: false,
            style: {
                borderRadius: 8,
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
        },
        secondary: {
            type: 'default' as const,
            danger: false,
            style: {
                borderRadius: 8,
                fontWeight: 500,
                borderColor: '#d9d9d9'
            }
        },
        danger: {
            type: 'default' as const,
            danger: true,
            style: {
                borderRadius: 8,
                fontWeight: 500,
                borderColor: '#ff4d4f'
            }
        }
    }[variant]

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
        >
            <Button
                {...variantProps}
                size={size}
                loading={loading}
                disabled={disabled}
                icon={icon}
                onClick={onClick}
                className={className}
            >
                {children}
            </Button>
        </motion.div>
    )
}
