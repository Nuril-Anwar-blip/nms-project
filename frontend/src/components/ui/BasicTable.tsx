/** AUTO-DOC: src/components/ui/BasicTable.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/ui/BasicTable.tsx
 * 
 * Komponen Table dasar untuk NMS
 * 
 * Fungsi:
 * - Table yang sederhana dan reusable
 * - Customizable columns dan data source
 * - Pagination dan sorting
 * 
 * Props:
 * - columns: ColumnType[] - konfigurasi kolom
 * - dataSource: any[] - data table
 * - loading?: boolean - loading state
 * - pagination?: PaginationConfig - konfigurasi pagination
 */

import { Table } from 'antd'

interface BasicTableProps {
    columns: any[]
    dataSource: any[]
    loading?: boolean
    pagination?: any
    size?: 'small' | 'middle' | 'large'
    scroll?: { x?: number; y?: number }
}

export default function BasicTable({
    columns,
    dataSource,
    loading = false,
    pagination,
    size = 'middle',
    scroll
}: BasicTableProps) {
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            size={size}
            scroll={scroll}
        />
    )
}
