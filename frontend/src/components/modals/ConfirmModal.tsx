/** AUTO-DOC: src/components/modals/ConfirmModal.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

import React from 'react'
import { Modal } from 'antd'

interface Props {
    open: boolean
    title?: React.ReactNode
    onOk?: () => void
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
}

export default function ConfirmModal({ open, title, onOk, onCancel, confirmText = 'OK', cancelText = 'Cancel' }: Props) {
    return (
        <Modal open={open} title={title} onOk={onOk} onCancel={onCancel} okText={confirmText} cancelText={cancelText}>
            <div>Are you sure?</div>
        </Modal>
    )
}

