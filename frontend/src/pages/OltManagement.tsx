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
import Table, { TableColumn } from '../components/Table'
import Modal from '../components/Modal'
import Card from '../components/Card'
import type { Olt, OltCreate } from '../types'

export default function OltManagement() {
  const { olts, loading, createOlt, updateOlt, deleteOlt, fetchOlts } = useOlts(true, 60000)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingOlt, setEditingOlt] = useState<Olt | null>(null)
  const [formData, setFormData] = useState<OltCreate>({
    name: '',
    ip_address: '',
    model: '',
    snmp_community: 'public',
    snmp_version: 2,
    snmp_port: 161
  })

  /**
   * Handle submit form untuk create atau update OLT
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingOlt) {
        await updateOlt(editingOlt.id, formData)
      } else {
        await createOlt(formData)
      }
      setIsModalOpen(false)
      setEditingOlt(null)
      setFormData({
        name: '',
        ip_address: '',
        model: '',
        snmp_community: 'public',
        snmp_version: 2,
        snmp_port: 161
      })
    } catch (error) {
      alert('Failed to save OLT: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Handle delete OLT dengan konfirmasi
   */
  const handleDelete = async (olt: Olt) => {
    if (!confirm(`Are you sure you want to delete OLT "${olt.name}"?`)) {
      return
    }
    try {
      await deleteOlt(olt.id)
    } catch (error) {
      alert('Failed to delete OLT: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Handle edit OLT - buka modal dengan data OLT
   */
  const handleEdit = (olt: Olt) => {
    setEditingOlt(olt)
    setFormData({
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
    setFormData({
      name: '',
      ip_address: '',
      model: '',
      snmp_community: 'public',
      snmp_version: 2,
      snmp_port: 161
    })
  }

  /**
   * Definisikan kolom tabel
   */
  const columns: TableColumn<Olt>[] = [
    {
      key: 'name',
      label: 'Name'
    },
    {
      key: 'ip_address',
      label: 'IP Address'
    },
    {
      key: 'model',
      label: 'Model'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'online' ? 'bg-green-100 text-green-800' :
          value === 'offline' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'cpu_usage',
      label: 'CPU',
      render: (value: number | null) => value !== null ? `${value.toFixed(1)}%` : '-'
    },
    {
      key: 'memory_usage',
      label: 'Memory',
      render: (value: number | null) => value !== null ? `${value.toFixed(1)}%` : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Olt) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <Card
        title="OLT Management"
        headerAction={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add OLT
          </button>
        }
      >
        <Table
          columns={columns}
          data={olts}
          loading={loading}
          emptyMessage="No OLTs found. Click 'Add OLT' to create one."
        />
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingOlt ? 'Edit OLT' : 'Add New OLT'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingOlt ? 'Update' : 'Create'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IP Address *</label>
            <input
              type="text"
              required
              value={formData.ip_address}
              onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="192.168.1.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Model</option>
              <option value="C300">C300</option>
              <option value="C320">C320</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SNMP Community</label>
              <input
                type="text"
                value={formData.snmp_community}
                onChange={(e) => setFormData({ ...formData, snmp_community: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SNMP Version</label>
              <select
                value={formData.snmp_version}
                onChange={(e) => setFormData({ ...formData, snmp_version: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="2">v2c</option>
                <option value="3">v3</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SNMP Port</label>
            <input
              type="number"
              value={formData.snmp_port}
              onChange={(e) => setFormData({ ...formData, snmp_port: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
