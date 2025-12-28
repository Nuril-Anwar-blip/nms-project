/** AUTO-DOC: src/components/table/OnuTable.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/table/OnuTable.tsx
 * 
 * Komponen Table untuk menampilkan data ONU
 */

import { Table, Tag, Button, Space, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Onu } from '../../types'
import StatusBadge from '../status/StatusBadge'

interface OnuTableProps {
    data: Onu[]
    loading?: boolean
    onEdit?: (onu: Onu) => void
    onDelete?: (onu: Onu) => void
    onReboot?: (onu: Onu) => void
}

export default function OnuTable({ data, loading, onEdit, onDelete, onReboot }: OnuTableProps) {
    const columns: ColumnsType<Onu> = [
        {
            title: 'Serial Number',
            dataIndex: 'serial_number',
            key: 'serial_number',
            width: 150,
            render: (text) => <span className="font-mono text-sm">{text}</span>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text || '-'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => <StatusBadge status={status} size="sm" />
        },
        {
            title: 'PON Port',
            dataIndex: 'pon_port',
            key: 'pon_port',
            width: 80,
            render: (text) => text
        },
        {
            title: 'ONU ID',
            dataIndex: 'onu_id',
            key: 'onu_id',
            width: 80,
            render: (text) => text
        },
        {
            title: 'RX Power',
            dataIndex: 'rx_power',
            key: 'rx_power',
            width: 100,
            render: (power) => power ? `${power.toFixed(2)} dBm` : '-'
        },
        {
            title: 'TX Power',
            dataIndex: 'tx_power',
            key: 'tx_power',
            width: 100,
            render: (power) => power ? `${power.toFixed(2)} dBm` : '-'
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            size="small"
                            onClick={() => onEdit?.(record)}
                        >
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title="Reboot">
                        <Button
                            type="link"
                            size="small"
                            onClick={() => onReboot?.(record)}
                        >
                            Reboot
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="link"
                            size="small"
                            danger
                            onClick={() => onDelete?.(record)}
                        >
                            Delete
                        </Button>
                    </Tooltip>
                </Space>
            )
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
            }}
            scroll={{ x: 800 }}
        />
    )
}