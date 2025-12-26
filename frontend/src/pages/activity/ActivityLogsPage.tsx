/**
 * File: pages/activity/ActivityLogsPage.tsx
 * 
 * Halaman Activity Logs untuk melihat log aktivitas sistem
 * 
 * Fungsi:
 * - Menampilkan daftar log aktivitas
 * - Filter berdasarkan user, action, date range
 * - Search functionality
 * - Pagination untuk data yang besar
 * - Export logs
 * 
 * Data yang ditampilkan:
 * - Timestamp
 * - User yang melakukan aksi
 * - Action yang dilakukan
 * - Target object
 * - IP address
 * - Description
 */

import { useState, useEffect } from 'react'
import { getActivityLogs } from '../../services/api'
import type { ActivityLog } from '../../types'
import CustomTable from '../../components/ui/CustomTable'
import { Card, Input, Select, DatePicker, Button, Space, Tag } from 'antd'
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [filters, setFilters] = useState({
        user: '',
        action: '',
        dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null
    })

    useEffect(() => {
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            // TODO: Implement API call with filters
            const data = await getActivityLogs()
            setLogs(data)
        } catch (error) {
            console.error('Failed to fetch activity logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            width: 120,
            render: (user: string) => <Tag color="blue">{user}</Tag>
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 100,
            render: (action: string) => {
                const colorMap: Record<string, string> = {
                    'CREATE': 'green',
                    'UPDATE': 'orange',
                    'DELETE': 'red',
                    'LOGIN': 'blue',
                    'LOGOUT': 'gray'
                }
                return <Tag color={colorMap[action] || 'default'}>{action}</Tag>
            }
        },
        {
            title: 'Target',
            dataIndex: 'target_type',
            key: 'target_type',
            width: 100,
            render: (target: string) => <Tag>{target}</Tag>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'IP Address',
            dataIndex: 'ip_address',
            key: 'ip_address',
            width: 120
        }
    ]

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
                    <Button icon={<DownloadOutlined />}>Export Logs</Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Input
                        placeholder="Search user..."
                        prefix={<SearchOutlined />}
                        value={filters.user}
                        onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                    />
                    <Select
                        placeholder="Filter action"
                        allowClear
                        value={filters.action}
                        onChange={(value) => setFilters({ ...filters, action: value || '' })}
                    >
                        <Select.Option value="CREATE">Create</Select.Option>
                        <Select.Option value="UPDATE">Update</Select.Option>
                        <Select.Option value="DELETE">Delete</Select.Option>
                        <Select.Option value="LOGIN">Login</Select.Option>
                        <Select.Option value="LOGOUT">Logout</Select.Option>
                    </Select>
                    <RangePicker
                        placeholder={['Start date', 'End date']}
                        value={filters.dateRange}
                        onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
                    />
                    <Button onClick={fetchLogs}>Apply Filters</Button>
                </div>

                {/* Table */}
                <CustomTable
                    columns={columns}
                    dataSource={logs}
                    loading={loading}
                    pagination={{
                        total: logs.length,
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    )
}
