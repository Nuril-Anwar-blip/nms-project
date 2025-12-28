/** AUTO-DOC: src/components/ui/BasicModal.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/ui/BasicModal.tsx
 * 
 * Komponen Modal dasar untuk NMS
 * 
 * Fungsi:
 * - Modal yang sederhana dan reusable
 * - Customizable title dan content
 * - Handle close dan submit
 * 
 * Props:
 * - title: string - judul modal
 * - open: boolean - status modal terbuka/tutup
 * - onCancel: () => void - handler untuk close modal
 * - onOk?: () => void - handler untuk OK button
 * - children: React.ReactNode - content modal
 */

import { Modal } from 'antd'

interface BasicModalProps {
    title: string
    open: boolean
    onCancel: () => void
    onOk?: () => void
    children: React.ReactNode
    width?: number
    okText?: string
    cancelText?: string
}

export default function BasicModal({
    title,
    open,
    onCancel,
    onOk,
    children,
    width = 520,
    okText = 'OK',
    cancelText = 'Cancel'
}: BasicModalProps) {
    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            width={width}
            okText={okText}
            cancelText={cancelText}
            centered
            destroyOnClose
        >
            {children}
        </Modal>
    )
}
