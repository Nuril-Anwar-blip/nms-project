/** AUTO-DOC: src/components/ui/LoadingSpinner.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

import React from 'react'
import { Spin } from 'antd'

export default function LoadingSpinner({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
    return (
        <div className="flex items-center justify-center h-full">
            <Spin size={size} />
        </div>
    )
}

