/** AUTO-DOC: src/components/ui/EntityCard.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

import React from 'react'
import { Card } from 'antd'

interface Props {
    title?: React.ReactNode
    children?: React.ReactNode
}

export default function EntityCard({ title, children }: Props) {
    return (
        <Card title={title} bordered className="shadow-sm">
            {children}
        </Card>
    )
}

