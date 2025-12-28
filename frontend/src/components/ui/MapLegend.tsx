/** AUTO-DOC: src/components/ui/MapLegend.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

import React from 'react'

export default function MapLegend() {
    return (
        <div className="p-2 text-sm bg-white rounded shadow">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full" />
                <span>OLT</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-3 h-3 bg-green-600 rounded-full" />
                <span>ONU</span>
            </div>
        </div>
    )
}

