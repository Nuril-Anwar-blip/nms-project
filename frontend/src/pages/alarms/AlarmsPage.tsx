/** AUTO-DOC: src/pages/alarms/AlarmsPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/alarms/AlarmsPage.tsx
 * 
 * Halaman Alarms untuk monitoring dan management alarm
 * 
 * Fungsi:
 * - Menampilkan daftar alarm aktif
 * - Filter berdasarkan severity, status, date range
 * - Acknowledge alarm
 * - Clear alarm
 * - Export alarm data
 * 
 * Data yang ditampilkan:
 * - Alarm ID dan timestamp
 * - Severity level (critical, major, minor)
 * - Alarm description
 * - Source device
 * - Status (active, acknowledged, cleared)
 * - Actions (acknowledge, clear)
 */

import { useState, useEffect } from 'react'
import { getAlarms, acknowledgeAlarm, clearAlarm } from '../../services/api'
import type { Alarm } from '../../types'
import AlarmCard from '../../components/cards/AlarmCard'
import SeverityBadge from '../../components/status/SeverityBadge'
import CustomTable from '../../components/ui/CustomTable'
import { Card, Select, DatePicker, Button, Space, Tag, Input } from 'antd'
import {
    AlertOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined,
    DownloadOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

export default function AlarmsPage() {
    const [alarms, setAlarms] = useState<Alarm[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [filters, setFilters] = useState({
        severity: '',
        status: '',
        search: '',
        dateRange: null as any
    })

    useEffect(() => {
        fetchAlarms()
    }, [])

    const fetchAlarms = async () => {
        try {
            const data = await getAlarms()
            setAlarms(data)
        } catch (error) {
            console.error('Failed to fetch alarms:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAcknowledge = async (alarmId: number) => {
        try {
            await acknowledgeAlarm(alarmId)
            fetchAlarms()
        } catch (error) {
            console.error('Failed to acknowledge alarm:', error)
        }
    }

    const handleClear = async (alarmId: number) => {
        try {
            await clearAlarm(alarmId)
            fetchAlarms()
        } catch (error) {
            console.error('Failed to clear alarm:', error)
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80
        },
        {
            title: 'Timestamp',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'Severity',
            dataIndex: 'severity',
            key: 'severity',
            width: 100,
            render: (severity: string) => <SeverityBadge value={severity} />
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    'active': 'red',
                    'acknowledged': 'orange',
                    'cleared': 'green'
                }
                return <Tag color={colorMap[status]}>{status}</Tag>
            }
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            width: 120
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_: any, record: Alarm) => (
                <Space>
                    {record.status === 'active' && (
                        <Button
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleAcknowledge(record.id)}
                        >
                            Ack
                        </Button>
                    )}
                    <Button
                        size="small"
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleClear(record.id)}
                        danger
                    >
                        Clear
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        <AlertOutlined className="mr-2" />
                        Alarm Management
                    </h2>
                    <Button icon={<DownloadOutlined />}>Export</Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Input
                        placeholder="Search alarms..."
                        prefix={<SearchOutlined />}
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <Select
                        placeholder="Filter severity"
                        allowClear
                        value={filters.severity}
                        onChange={(value) => setFilters({ ...filters, severity: value || '' })}
                    >
                        <Select.Option value="critical">Critical</Select.Option>
                        <Select.Option value="major">Major</Select.Option>
                        <Select.Option value="minor">Minor</Select.Option>
                    </Select>
                    <Select
                        placeholder="Filter status"
                        allowClear
                        value={filters.status}
                        onChange={(value) => setFilters({ ...filters, status: value || '' })}
                    >
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="acknowledged">Acknowledged</Select.Option>
                        <Select.Option value="cleared">Cleared</Select.Option>
                    </Select>
                    <RangePicker
                        placeholder={['Start date', 'End date']}
                        value={filters.dateRange}
                        onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                    />
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {alarms.filter(a => a.severity === 'critical').length}
                            </div>
                            <div className="text-gray-600">Critical</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {alarms.filter(a => a.severity === 'major').length}
                            </div>
                            <div className="text-gray-600">Major</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {alarms.filter(a => a.severity === 'minor').length}
                            </div>
                            <div className="text-gray-600">Minor</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {alarms.filter(a => a.status === 'active').length}
                            </div>
                            <div className="text-gray-600">Active</div>
                        </div>
                    </Card>
                </div>

                {/* Table */}
                <CustomTable
                    columns={columns}
                    dataSource={alarms}
                    loading={loading}
                    pagination={{
                        total: alarms.length,
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total: number, range: [number, number]) =>
                            `${range[0]}-${range[1]} of ${total} items`
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    )
}
