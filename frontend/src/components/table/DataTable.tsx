/** AUTO-DOC: src/components/table/DataTable.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

import React from 'react'
import { Table } from 'antd'
import type { TableProps } from 'antd'

export default function DataTable<RecordType = any>(props: TableProps<RecordType>) {
    return <Table {...props} />
}

