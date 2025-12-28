/** AUTO-DOC: src/pages/OltManagement.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/OltManagement.tsx
 * 
 * Halaman manajemen OLT untuk menambah, mengedit, dan menghapus OLT
 * 
 * Fungsi:
 * - Menampilkan daftar semua OLT dalam tabel
 * - Menambah OLT baru dengan form modal
 * - Mengedit informasi OLT
 * - Menghapus OLT
 * - Menampilkan status dan performa OLT
 * 
 * Alur kerja:
 * 1. Load daftar OLT saat halaman dimuat
 * 2. User dapat klik "Add OLT" untuk membuka form modal
 * 3. User mengisi form dan submit untuk create OLT baru
 * 4. User dapat klik row untuk melihat detail atau edit
 * 5. User dapat klik delete untuk menghapus OLT
 * 
 * Data yang ditampilkan:
 * - Name, IP Address, Model, Status
 * - CPU Usage, Memory Usage, Temperature
 * - Last Polled timestamp
 */

import { useState } from 'react'
import { useOlts } from '../hooks/useOlts'
import type { Olt, OltCreate } from '../types'
import { Table, Modal, Form, Input, Select, InputNumber, Button, Space, Tag, message, Card } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function OltManagement() {
  const { olts, loading, createOlt, updateOlt, deleteOlt } = useOlts(true, 60000)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingOlt, setEditingOlt] = useState<Olt | null>(null)
  const [form] = Form.useForm<OltCreate>()

  /**
   * Handle submit form untuk create atau update OLT
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingOlt) {
        await updateOlt(editingOlt.id, values)
        message.success('OLT berhasil diperbarui')
      } else {
        await createOlt(values)
        message.success('OLT baru berhasil dibuat')
      }
      setIsModalOpen(false)
      setEditingOlt(null)
      form.resetFields()
    } catch (error) {
      message.error('Gagal menyimpan OLT')
    }
  }

  /**
   * Handle delete OLT dengan konfirmasi
   */
  const handleDelete = async (olt: Olt) => {
    Modal.confirm({
      title: 'Hapus OLT',
      icon: <ExclamationCircleOutlined />,
      content: `Apakah Anda yakin ingin menghapus OLT "${olt.name}"?`,
      okText: 'Hapus',
      okButtonProps: { danger: true },
      cancelText: 'Batal',
      onOk: async () => {
        try {
          await deleteOlt(olt.id)
          message.success('OLT berhasil dihapus')
        } catch {
          message.error('Gagal menghapus OLT')
        }
      }
    })
  }

  /**
   * Handle edit OLT - buka modal dengan data OLT
   */
  const handleEdit = (olt: Olt) => {
    setEditingOlt(olt)
    form.setFieldsValue({
      name: olt.name,
      ip_address: olt.ip_address,
      model: olt.model || '',
      snmp_community: olt.snmp_community,
      snmp_version: olt.snmp_version,
      snmp_port: olt.snmp_port
    })
    setIsModalOpen(true)
  }

  /**
   * Reset form dan close modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingOlt(null)
    form.resetFields()
  }

  /**
   * Definisikan kolom tabel
   */
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'IP Address', dataIndex: 'ip_address', key: 'ip_address' },
    { title: 'Model', dataIndex: 'model', key: 'model', render: (value: string) => value || '-' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <Tag color={value === 'online' ? 'green' : value === 'offline' ? 'red' : 'default'}>{value?.toUpperCase()}</Tag>
      )
    },
    {
      title: 'CPU',
      dataIndex: 'cpu_usage',
      key: 'cpu_usage',
      render: (value: number | null) => (value != null ? `${value.toFixed(1)}%` : '-')
    },
    {
      title: 'Memory',
      dataIndex: 'memory_usage',
      key: 'memory_usage',
      render: (value: number | null) => (value != null ? `${value.toFixed(1)}%` : '-')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, row: Olt) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(row)}>
            Delete
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <Card title="OLT Management" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingOlt(null); setIsModalOpen(true); }}>Add OLT</Button>}>
        <Table
          rowKey="id"
          columns={columns as any}
          dataSource={olts}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* Modal Form */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title={editingOlt ? 'Edit OLT' : 'Add New OLT'}
        okText={editingOlt ? 'Update' : 'Create'}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ snmp_community: 'public', snmp_version: 2, snmp_port: 161 }}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Nama OLT wajib diisi' }]}>
            <Input placeholder="Nama OLT" />
          </Form.Item>
          <Form.Item label="IP Address" name="ip_address" rules={[{ required: true, message: 'IP Address wajib diisi' }]}>
            <Input placeholder="192.168.1.1" />
          </Form.Item>
          <Form.Item label="Model" name="model">
            <Select placeholder="Pilih model">
              <Select.Option value="">Tidak ditentukan</Select.Option>
              <Select.Option value="C300">C300</Select.Option>
              <Select.Option value="C320">C320</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="SNMP Community" name="snmp_community">
            <Input />
          </Form.Item>
          <Form.Item label="SNMP Version" name="snmp_version">
            <Select>
              <Select.Option value={2}>v2c</Select.Option>
              <Select.Option value={3}>v3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="SNMP Port" name="snmp_port">
            <InputNumber min={1} max={65535} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
