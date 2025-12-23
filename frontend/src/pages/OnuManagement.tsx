/**
 * File: pages/OnuManagement.tsx
 * 
 * Halaman manajemen ONU untuk melihat, mengedit, dan menghapus ONU
 * 
 * Fungsi:
 * - Menampilkan daftar semua ONU dalam tabel
 * - Filter ONU berdasarkan OLT atau status
 * - Mengedit informasi ONU (nama, description)
 * - Melihat detail ONU (RX/TX power, status, dll)
 * - Aksi ONU: reboot, reset, delete
 * 
 * Alur kerja:
 * 1. Load daftar ONU saat halaman dimuat
 * 2. User dapat filter berdasarkan OLT atau status
 * 3. User dapat klik row untuk melihat detail
 * 4. User dapat melakukan aksi: edit, reboot, reset, delete
 * 
 * Data yang ditampilkan:
 * - Serial Number, Name, OLT, PON Port, ONU ID
 * - Status (online/offline), RX/TX Power
 * - Last Seen timestamp
 */

import { useState, useEffect } from 'react'
import { useOnus } from '../hooks/useOnus'
import { useOlts } from '../hooks/useOlts'
import { rebootOnu, resetOnu } from '../services/api'
import Table, { TableColumn } from '../components/Table'
import Card from '../components/Card'
import type { Onu } from '../types'

export default function OnuManagement() {
  const { onus, loading, fetchOnus, deleteOnu } = useOnus()
  const { olts } = useOlts()
  const [selectedOltId, setSelectedOltId] = useState<number | ''>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    // Fetch ONU dengan filter
    const filters: { olt_id?: number; status?: string } = {}
    if (selectedOltId) filters.olt_id = selectedOltId as number
    if (selectedStatus) filters.status = selectedStatus
    fetchOnus(Object.keys(filters).length > 0 ? filters : undefined)
  }, [selectedOltId, selectedStatus, fetchOnus])

  /**
   * Handle reboot ONU
   */
  const handleReboot = async (onu: Onu) => {
    if (!confirm(`Are you sure you want to reboot ONU "${onu.serial_number}"?`)) {
      return
    }
    try {
      await rebootOnu(onu.id)
      alert('ONU reboot command sent successfully')
      fetchOnus()
    } catch (error) {
      alert('Failed to reboot ONU: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Handle reset ONU ke factory default
   */
  const handleReset = async (onu: Onu) => {
    if (!confirm(`Are you sure you want to reset ONU "${onu.serial_number}" to factory default? This action cannot be undone.`)) {
      return
    }
    try {
      await resetOnu(onu.id)
      alert('ONU reset command sent successfully')
      fetchOnus()
    } catch (error) {
      alert('Failed to reset ONU: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Handle delete ONU
   */
  const handleDelete = async (onu: Onu) => {
    if (!confirm(`Are you sure you want to delete ONU "${onu.serial_number}"?`)) {
      return
    }
    try {
      await deleteOnu(onu.id)
    } catch (error) {
      alert('Failed to delete ONU: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Get OLT name by ID
   */
  const getOltName = (oltId: number): string => {
    const olt = olts.find(o => o.id === oltId)
    return olt?.name || `OLT-${oltId}`
  }

  /**
   * Definisikan kolom tabel
   */
  const columns: TableColumn<Onu>[] = [
    {
      key: 'serial_number',
      label: 'Serial Number'
    },
    {
      key: 'name',
      label: 'Name',
      render: (value: string) => value || '-'
    },
    {
      key: 'olt_id',
      label: 'OLT',
      render: (value: number) => getOltName(value)
    },
    {
      key: 'pon_port',
      label: 'PON Port'
    },
    {
      key: 'onu_id',
      label: 'ONU ID'
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
      key: 'rx_power',
      label: 'RX Power',
      render: (value: number | null) => value !== null && value !== undefined ? `${value.toFixed(2)} dBm` : '-'
    },
    {
      key: 'tx_power',
      label: 'TX Power',
      render: (value: number | null) => value !== null && value !== undefined ? `${value.toFixed(2)} dBm` : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Onu) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleReboot(row)}
            className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
            title="Reboot ONU"
          >
            🔄
          </button>
          <button
            onClick={() => handleReset(row)}
            className="px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
            title="Reset to Factory Default"
          >
            🔧
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            title="Delete ONU"
          >
            🗑️
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <Card title="ONU Management">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by OLT</label>
            <select
              value={selectedOltId}
              onChange={(e) => setSelectedOltId(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All OLTs</option>
              {olts.map(olt => (
                <option key={olt.id} value={olt.id}>{olt.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => fetchOnus()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={onus}
          loading={loading}
          emptyMessage="No ONUs found. Try adjusting filters or provision new ONUs."
        />
      </Card>
    </div>
  )
}
