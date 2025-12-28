/** AUTO-DOC: src/components/ui/CustomModal.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/ui/CustomModal.tsx
 * 
 * Komponen Modal kustom untuk NMS dengan styling konsisten
 * 
 * Fungsi:
 * - Modal yang reusable untuk berbagai keperluan
 * - Customizable size dan style
 * - Animasi dengan Framer Motion
 * - Integration dengan Ant Design Modal
 * 
 * Props:
 * - title: string - judul modal
 * - open: boolean - status modal terbuka/tutup
 * - onCancel: () => void - handler untuk close modal
 * - onOk?: () => void - handler untuk OK button
 * - children: React.ReactNode - content modal
 * - size?: 'small' | 'medium' | 'large' - ukuran modal
 * - footer?: React.ReactNode - custom footer
 */

import { Modal } from 'antd'
import { motion } from 'framer-motion'

interface CustomModalProps {
    title: string
    open: boolean
    onCancel: () => void
    onOk?: () => void
    children: React.ReactNode
    size?: 'small' | 'medium' | 'large'
    footer?: React.ReactNode
    width?: number
    className?: string
}

export default function CustomModal({
    title,
    open,
    onCancel,
    onOk,
    children,
    size = 'medium',
    footer,
    width,
    className = ''
}: CustomModalProps) {
    const getWidth = () => {
        if (width) return width
        switch (size) {
            case 'small': return 400
            case 'medium': return 600
            case 'large': return 800
            default: return 600
        }
    }

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            width={getWidth()}
            footer={footer}
            className={className}
            centered
            destroyOnClose
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </Modal>
    )
}
