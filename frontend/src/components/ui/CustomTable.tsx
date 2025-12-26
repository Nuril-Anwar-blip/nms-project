/**
 * File: components/ui/CustomTable.tsx
 * 
 * Komponen Table kustom untuk NMS dengan styling konsisten
 * 
 * Fungsi:
 * - Table yang reusable untuk berbagai data
 * - Customizable columns dan actions
 * - Pagination dan sorting
 * - Integration dengan Ant Design Table
 * - Loading state dan empty state
 * 
 * Props:
 * - columns: ColumnType[] - konfigurasi kolom
 * - dataSource: any[] - data table
 * - loading: boolean - loading state
 * - pagination?: PaginationConfig - konfigurasi pagination
 * - rowSelection?: RowSelectionConfig - konfigurasi row selection
 * - onRow?: (record: any) => any - custom row props
 */

import { Table, Empty } from 'antd'
import { motion } from 'framer-motion'

interface CustomTableProps {
    columns: any[]
    dataSource: any[]
    loading?: boolean
    pagination?: any
    rowSelection?: any
    onRow?: (record: any) => any
    scroll?: { x?: number; y?: number }
    size?: 'small' | 'middle' | 'large'
    className?: string
}

export default function CustomTable({
    columns,
    dataSource,
    loading = false,
    pagination,
    rowSelection,
    onRow,
    scroll,
    size = 'middle',
    className = ''
}: CustomTableProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                rowSelection={rowSelection}
                onRow={onRow}
                scroll={scroll}
                size={size}
                className={className}
                locale={{
                    emptyText: (
                        <Empty
                            description="No data available"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    )
                }}
            />
        </motion.div>
    )
}
