/**
 * File: pages/Alarms.tsx
 * 
 * Halaman manajemen alarm untuk melihat, acknowledge, dan clear alarm
 * 
 * Fungsi:
 * - Menampilkan daftar alarm dengan filter
 * - Filter berdasarkan severity, status, OLT, atau ONU
 * - Acknowledge alarm (menandai sudah ditangani)
 * - Clear alarm (menandai sudah selesai)
 * - Menampilkan detail alarm (message, occurred time, dll)
 * 
 * Alur kerja:
 * 1. Load daftar alarm saat halaman dimuat
 * 2. User dapat filter alarm berdasarkan kriteria
 * 3. User dapat acknowledge alarm untuk menandai sudah ditangani
 * 4. User dapat clear alarm jika sudah selesai
 * 5. Auto-refresh untuk mendapatkan alarm baru
 * 
 * Data yang ditampilkan:
 * - Severity (critical, major, minor, warning, info)
 * - Type dan message alarm
 * - Status (active, acknowledged, cleared)
 * - OLT/ONU terkait
 * - Waktu terjadinya alarm
 */

import { useState, useEffect } from 'react'
import { getAlarms, acknowledgeAlarm } from '../services/api'
import { useOlts } from '../hooks/useOlts'
import Table, { TableColumn } from '../components/Table'
import Card from '../components/Card'
import type { Alarm } from '../types'

export default function Alarms() {
  const { olts } = useOlts()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<{
    status?: string
    severity?: string
    olt_id?: number
  }>({
    status: 'active'
  })

  /**
   * Fetch alarm dari API dengan filter
   */
  const fetchAlarms = async () => {
    try {
      setLoading(true)
      const data = await getAlarms(filters)
      setAlarms(data)
    } catch (error) {
      console.error('Failed to fetch alarms:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlarms()
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchAlarms, 30000)
    return () => clearInterval(interval)
  }, [filters])

  /**
   * Handle acknowledge alarm
   */
  const handleAcknowledge = async (alarm: Alarm) => {
    try {
      await acknowledgeAlarm(alarm.id)
      await fetchAlarms()
      alert('Alarm acknowledged')
    } catch (error) {
      alert('Failed to acknowledge alarm: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  /**
   * Get OLT name by ID
   */
  const getOltName = (oltId?: number): string => {
    if (!oltId) return '-'
    const olt = olts.find(o => o.id === oltId)
    return olt?.name || `OLT-${oltId}`
  }

  /**
   * Warna badge berdasarkan severity
   */
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'major':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'warning':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  /**
   * Definisikan kolom tabel
   */
  const columns: TableColumn<Alarm>[] = [
    {
      key: 'severity',
      label: 'Severity',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(value)}`}>
          {value.toUpperCase()}
        </span>
      )
    },
    {
      key: 'type',
      label: 'Type'
    },
    {
      key: 'message',
      label: 'Message',
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      )
    },
    {
      key: 'olt_id',
      label: 'OLT',
      render: (value: number | undefined) => getOltName(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-red-100 text-red-800' :
          value === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'occurred_at',
      label: 'Occurred At',
      render: (value: string) => new Date(value).toLocaleString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Alarm) => (
        <div className="flex gap-2">
          {row.status === 'active' && (
            <button
              onClick={() => handleAcknowledge(row)}
              className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Acknowledge
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <Card title="Alarm Management">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="cleared">Cleared</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={filters.severity || ''}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Severity</option>
              <option value="critical">Critical</option>
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OLT</label>
            <select
              value={filters.olt_id || ''}
              onChange={(e) => setFilters({ ...filters, olt_id: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All OLTs</option>
              {olts.map(olt => (
                <option key={olt.id} value={olt.id}>{olt.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchAlarms}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Alarm Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {alarms.filter(a => a.severity === 'critical' && a.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Critical Active</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {alarms.filter(a => a.severity === 'major' && a.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Major Active</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {alarms.filter(a => a.severity === 'minor' && a.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Minor Active</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {alarms.length}
            </div>
            <div className="text-sm text-gray-600">Total Alarms</div>
          </div>
        </div>

        <Table
          columns={columns}
          data={alarms}
          loading={loading}
          emptyMessage="No alarms found"
        />
      </Card>
    </div>
  )
}
