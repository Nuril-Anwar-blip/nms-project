/**
 * File: pages/onu-management/OnuManagementPage.tsx
 * 
 * Halaman ONU Management untuk mengelola perangkat ONU
 * 
 * Fungsi:
 * - Menampilkan daftar ONU
 * - Add/Edit/Delete ONU
 * - Monitor ONU status
 * - Konfigurasi ONU
 * - Reboot ONU
 * 
 * Data yang ditampilkan:
 * - ONU name dan serial number
 * - Status (online/offline)
 * - Signal strength (RX/TX power)
 * - OLT dan PON port assignment
 * - Service profile
 */

import { useState, useEffect } from 'react'
import { getOnus, createOnu, updateOnu, deleteOnu, rebootOnu } from '../../services/api'
import type { Onu } from '../../types'
import StatusBadge from '../../components/status/StatusBadge'
import CustomTable from '../../components/ui/CustomTable'
import CustomModal from '../../components/ui/CustomModal'
import { Card, Button, Form, Input, Select, Space, Tag, message } from 'antd'
import {
    WifiOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ReloadOutlined
} from '@ant-design/icons'

export default function OnuManagementPage() {
    const [onus, setOnus] = useState<Onu[]>([])
    const [olts, setOlts] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [editingOnu, setEditingOnu] = useState<Onu | null>(null)
    const [form] = Form.useForm()

    useEffect(() => {
        fetchOnus()
        fetchOlts()
    }, [])

    const fetchOnus = async () => {
        try {
            const data = await getOnus()
            setOnus(data)
        } catch (error) {
            console.error('Failed to fetch ONUs:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchOlts = async () => {
        try {
            // TODO: Implement fetch OLTs
            setOlts([])
        } catch (error) {
            console.error('Failed to fetch OLTs:', error)
        }
    }

    const handleAdd = () => {
        setEditingOnu(null)
        form.resetFields()
        setModalOpen(true)
    }

    const handleEdit = (onu: Onu) => {
        setEditingOnu(onu)
        form.setFieldsValue(onu)
        setModalOpen(true)
    }

    const handleDelete = (onu: Onu) => {
        // TODO: Implement delete confirmation
        console.log('Delete ONU:', onu)
    }

    const handleReboot = async (onu: Onu) => {
        try {
            await rebootOnu(onu.id)
            message.success('ONU reboot initiated')
        } catch (error) {
            message.error('Failed to reboot ONU')
        }
    }

    const handleSubmit = async (values: any) => {
        try {
            if (editingOnu) {
                await updateOnu(editingOnu.id, values)
                message.success('ONU updated successfully')
            } else {
                await createOnu(values)
                message.success('ONU created successfully')
            }
            setModalOpen(false)
            fetchOnus()
        } catch (error) {
            message.error('Failed to save ONU')
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Onu) => (
                <div>
                    <div className="font-medium">{name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{record.serial_number}</div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => <StatusBadge status={status} />
        },
        {
            title: 'OLT',
            dataIndex: 'olt_name',
            key: 'olt_name',
            width: 120
        },
        {
            title: 'PON Port',
            dataIndex: 'pon_port',
            key: 'pon_port',
            width: 80,
            render: (port: number) => <Tag>{port}</Tag>
        },
        {
            title: 'ONU ID',
            dataIndex: 'onu_id',
            key: 'onu_id',
            width: 80,
            render: (id: number) => <Tag>{id}</Tag>
        },
        {
            title: 'RX Power',
            dataIndex: 'rx_power',
            key: 'rx_power',
            width: 100,
            render: (power: number) => (
                <Tag color={power > -20 ? 'green' : power > -25 ? 'orange' : 'red'}>
                    {power?.toFixed(2)} dBm
                </Tag>
            )
        },
        {
            title: 'TX Power',
            dataIndex: 'tx_power',
            key: 'tx_power',
            width: 100,
            render: (power: number) => (
                <Tag color={power > 0 ? 'green' : 'orange'}>
                    {power?.toFixed(2)} dBm
                </Tag>
            )
        },
        {
            title: 'Profile',
            dataIndex: 'service_profile',
            key: 'service_profile',
            width: 100,
            render: (profile: string) => <Tag>{profile || 'default'}</Tag>
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: Onu) => (
                <Space>
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={() => handleReboot(record)}
                        disabled={record.status !== 'online'}
                    >
                        Reboot
                    </Button>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                        danger
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        <WifiOutlined className="mr-2" />
                        ONU Management
                    </h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add ONU
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{onus.length}</div>
                            <div className="text-gray-600">Total ONUs</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {onus.filter(o => o.status === 'online').length}
                            </div>
                            <div className="text-gray-600">Online</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {onus.filter(o => o.status === 'offline').length}
                            </div>
                            <div className="text-gray-600">Offline</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {onus.filter(o => o.rx_power && o.rx_power < -25).length}
                            </div>
                            <div className="text-gray-600">Low Signal</div>
                        </div>
                    </Card>
                </div>

                {/* Table */}
                <CustomTable
                    columns={columns}
                    dataSource={onus}
                    loading={loading}
                    pagination={{
                        total: onus.length,
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total: number, range: [number, number]) =>
                            `${range[0]}-${range[1]} of ${total} items`
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <CustomModal
                title={editingOnu ? 'Edit ONU' : 'Add ONU'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="ONU Name"
                    >
                        <Input placeholder="Enter ONU name (optional)" />
                    </Form.Item>

                    <Form.Item
                        name="serial_number"
                        label="Serial Number"
                        rules={[{ required: true, message: 'Please enter serial number' }]}
                    >
                        <Input placeholder="ZTEG12345678" />
                    </Form.Item>

                    <Form.Item
                        name="olt_id"
                        label="OLT"
                        rules={[{ required: true, message: 'Please select OLT' }]}
                    >
                        <Select placeholder="Select OLT">
                            {olts.map((olt) => (
                                <Select.Option key={olt.id} value={olt.id}>
                                    {olt.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="pon_port"
                        label="PON Port"
                        rules={[{ required: true, message: 'Please enter PON port' }]}
                    >
                        <Input type="number" min={1} max={16} placeholder="1-16" />
                    </Form.Item>

                    <Form.Item
                        name="onu_id"
                        label="ONU ID"
                        rules={[{ required: true, message: 'Please enter ONU ID' }]}
                    >
                        <Input type="number" min={1} max={64} placeholder="1-64" />
                    </Form.Item>

                    <Form.Item
                        name="service_profile"
                        label="Service Profile"
                    >
                        <Select placeholder="Select service profile">
                            <Select.Option value="default">Default</Select.Option>
                            <Select.Option value="basic">Basic</Select.Option>
                            <Select.Option value="premium">Premium</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </CustomModal>
        </div>
    )
}
