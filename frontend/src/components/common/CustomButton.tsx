/** AUTO-DOC: src/components/common/CustomButton.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/common/CustomButton.tsx
 * 
 * Komponen Button kustom untuk NMS dengan styling konsisten
 */

import { Button } from 'antd'
import type { ButtonProps } from 'antd'
import { motion } from 'framer-motion'

interface CustomButtonProps extends ButtonProps {
    children: React.ReactNode
}

export default function CustomButton({
    children,
    type = 'primary',
    size = 'middle',
    loading = false,
    disabled = false,
    icon,
    className,
    htmlType,
    ...rest
}: CustomButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
        >
            <Button
                type={type}
                size={size}
                loading={loading}
                disabled={disabled}
                icon={icon}
                htmlType={htmlType}
                className={className}
                style={{
                    borderRadius: '8px',
                    fontWeight: 500
                }}
                {...rest}
            >
                {children}
            </Button>
        </motion.div>
    )
}