/** AUTO-DOC: src/pages/olt-management/OltManagementPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/olt-management/OltManagementPage.tsx
 * 
 * Halaman OLT Management untuk mengelola perangkat OLT
 * 
 * Fungsi:
 * - Menampilkan daftar OLT
 * - Add/Edit/Delete OLT
 * - Monitor OLT status
 * - Konfigurasi OLT
 * - Test koneksi OLT
 * 
 * Data yang ditampilkan:
 * - OLT name dan IP address
 * - Status (online/offline)
 * - Model dan firmware version
 * - CPU dan memory usage
 * - Port statistics
 */

import { useState, useEffect } from 'react'
import { getOlts, createOlt, updateOlt, deleteOlt, testOltConnection } from '../../services/api'
import type { Olt } from '../../types'
import StatusBadge from '../../components/status/StatusBadge'
import CustomTable from '../../components/ui/CustomTable'
import CustomModal from '../../components/ui/CustomModal'
import { Card, Button, Form, Input, Select, Space, Tag, message, Modal } from 'antd'
import {
    ApiOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,

} from '@ant-design/icons'

export default function OltManagementPage() {
    const [olts, setOlts] = useState<Olt[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [editingOlt, setEditingOlt] = useState<Olt | null>(null)
    const [form] = Form.useForm()

    useEffect(() => {
        fetchOlts()
    }, [])

    const fetchOlts = async () => {
        try {
            const data = await getOlts()
            setOlts(data)
        } catch (error) {
            console.error('Failed to fetch OLTs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setEditingOlt(null)
        form.resetFields()
        setModalOpen(true)
    }

    const handleEdit = (olt: Olt) => {
        setEditingOlt(olt)
        form.setFieldsValue(olt)
        setModalOpen(true)
    }

    const handleDelete = (olt: Olt) => {
        Modal.confirm({
            title: 'Hapus OLT',
            content: `Yakin ingin menghapus OLT ${olt.name} (${olt.ip_address})?`,
            okText: 'Hapus',
            okType: 'danger',
            cancelText: 'Batal',
            onOk: async () => {
                try {
                    await deleteOlt(olt.id)
                    message.success('OLT berhasil dihapus')
                    fetchOlts()
                } catch (error) {
                    message.error('Gagal menghapus OLT')
                }
            }
        })
    }

    const handleSubmit = async (values: any) => {
        try {
            if (editingOlt) {
                await updateOlt(editingOlt.id, values)
                message.success('OLT updated successfully')
            } else {
                await createOlt(values)
                message.success('OLT created successfully')
            }
            setModalOpen(false)
            fetchOlts()
        } catch (error) {
            message.error('Failed to save OLT')
        }
    }

    const handleTestConnection = async (olt: Olt) => {
        try {
            await testOltConnection(olt.id)
            message.success('Connection test successful')
        } catch (error) {
            message.error('Connection test failed')
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Olt) => (
                <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">{record.ip_address}</div>
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
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            width: 120
        },
        {
            title: 'Firmware',
            dataIndex: 'firmware_version',
            key: 'firmware_version',
            width: 120
        },
        {
            title: 'CPU',
            dataIndex: 'cpu_usage',
            key: 'cpu_usage',
            width: 80,
            render: (cpu: number) => (
                <Tag color={cpu > 80 ? 'red' : cpu > 60 ? 'orange' : 'green'}>
                    {cpu}%
                </Tag>
            )
        },
        {
            title: 'Memory',
            dataIndex: 'memory_usage',
            key: 'memory_usage',
            width: 80,
            render: (memory: number) => (
                <Tag color={memory > 80 ? 'red' : memory > 60 ? 'orange' : 'green'}>
                    {memory}%
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_: any, record: Olt) => (
                <Space>
                    <Button
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleTestConnection(record)}
                    >
                        Test
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
                        <ApiOutlined className="mr-2" />
                        OLT Management
                    </h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add OLT
                    </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{olts.length}</div>
                            <div className="text-gray-600">Total OLTs</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {olts.filter(o => o.status === 'online').length}
                            </div>
                            <div className="text-gray-600">Online</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {olts.filter(o => o.status === 'offline').length}
                            </div>
                            <div className="text-gray-600">Offline</div>
                        </div>
                    </Card>
                    <Card size="small">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {olts.filter(o => (o.cpu_usage || 0) > 80).length}
                            </div>
                            <div className="text-gray-600">High CPU</div>
                        </div>
                    </Card>
                </div>

                {/* Table */}
                <CustomTable
                    columns={columns}
                    dataSource={olts}
                    loading={loading}
                    pagination={{
                        total: olts.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total: number, range: [number, number]) =>
                            `${range[0]}-${range[1]} of ${total} items`
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <CustomModal
                title={editingOlt ? 'Edit OLT' : 'Add OLT'}
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
                        label="OLT Name"
                        rules={[{ required: true, message: 'Please enter OLT name' }]}
                    >
                        <Input placeholder="Enter OLT name" />
                    </Form.Item>

                    <Form.Item
                        name="ip_address"
                        label="IP Address"
                        rules={[
                            { required: true, message: 'Please enter IP address' },
                            { pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, message: 'Invalid IP address' }
                        ]}
                    >
                        <Input placeholder="192.168.1.1" />
                    </Form.Item>

                    <Form.Item
                        name="model"
                        label="Model"
                        rules={[{ required: true, message: 'Please select model' }]}
                    >
                        <Select placeholder="Select OLT model">
                            <Select.Option value="ZTE-C320">ZTE C320</Select.Option>
                            <Select.Option value="ZTE-C300">ZTE C300</Select.Option>
                            <Select.Option value="ZTE-C220">ZTE C220</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Location"
                    >
                        <Input placeholder="Enter location" />
                    </Form.Item>
                </Form>
            </CustomModal>
        </div>
    )
}
