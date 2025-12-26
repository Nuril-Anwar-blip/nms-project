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
import { Table, Card, Select, Button, Tag, notification, Input, InputNumber, DatePicker } from 'antd'
import SeverityBadge from '../components/SeverityBadge'
import type { Alarm } from '../types'
import dayjs from 'dayjs'

export default function Alarms() {
  const { olts } = useOlts()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<{
    status?: string
    severity?: string
    olt_id?: number
    onu_id?: number
    q?: string
    from?: string
    to?: string
  }>({
    status: 'active'
  })

  /**
   * Fetch alarm dari API dengan filter
   */
  const fetchAlarms = async () => {
    try {
      setLoading(true)
      const { from, to, q, ...apiFilters } = filters
      const data = await getAlarms(apiFilters)
      const filtered = data.filter(a => {
        const occurred = dayjs(a.occurred_at)
        const inRange =
          (!from || occurred.isAfter(dayjs(from).subtract(1, 'millisecond'))) &&
          (!to || occurred.isBefore(dayjs(to).add(1, 'millisecond')))
        const matchesQuery =
          !q ||
          a.message.toLowerCase().includes((q || '').toLowerCase()) ||
          a.type.toLowerCase().includes((q || '').toLowerCase())
        return inRange && matchesQuery
      })
      setAlarms(filtered)
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
      notification.success({ message: 'Alarm diacknowledge' })
    } catch (error) {
      notification.error({ message: 'Gagal acknowledge alarm' })
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
   * Definisikan kolom tabel
   */
  const columns = [
    { title: 'Severity', dataIndex: 'severity', key: 'severity', render: (v: string) => <SeverityBadge value={v} /> },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Message', dataIndex: 'message', key: 'message' },
    { title: 'OLT', dataIndex: 'olt_id', key: 'olt_id', render: (v?: number) => getOltName(v) },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v: string) => <Tag color={v === 'active' ? 'red' : v === 'cleared' ? 'green' : 'gold'}>{v.toUpperCase()}</Tag> },
    { title: 'Occurred At', dataIndex: 'occurred_at', key: 'occurred_at', render: (v: string) => new Date(v).toLocaleString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, row: Alarm) => (
        row.status === 'active' ? <Button size="small" type="default" onClick={() => handleAcknowledge(row)}>Acknowledge</Button> : null
      )
    }
  ]

  return (
    <div className="space-y-6">
      <Card title="Alarm Management">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Select
            value={filters.status || ''}
            onChange={(v) => setFilters({ ...filters, status: v || undefined })}
            placeholder="Status"
            allowClear
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'acknowledged', label: 'Acknowledged' },
              { value: 'cleared', label: 'Cleared' }
            ]}
          />
          <Select
            value={filters.severity || ''}
            onChange={(v) => setFilters({ ...filters, severity: v || undefined })}
            placeholder="Severity"
            allowClear
            options={[
              { value: '', label: 'All Severity' },
              { value: 'critical', label: 'Critical' },
              { value: 'major', label: 'Major' },
              { value: 'minor', label: 'Minor' },
              { value: 'warning', label: 'Warning' },
              { value: 'info', label: 'Info' }
            ]}
          />
          <Select
            value={filters.olt_id || undefined}
            onChange={(v) => setFilters({ ...filters, olt_id: v })}
            placeholder="OLT"
            options={[
              { value: undefined as any, label: 'All OLTs' },
              ...olts.map(olt => ({ value: olt.id, label: olt.name }))
            ]}
          />
          <InputNumber
            value={filters.onu_id}
            onChange={(v) => setFilters({ ...filters, onu_id: v || undefined })}
            placeholder="ONU ID"
            min={0}
            className="w-full"
          />
          <DatePicker.RangePicker
            value={
              filters.from && filters.to
                ? [dayjs(filters.from), dayjs(filters.to)]
                : undefined
            }
            onChange={(vals) =>
              setFilters({
                ...filters,
                from: vals?.[0]?.toISOString(),
                to: vals?.[1]?.toISOString()
              })
            }
            className="w-full"
            allowClear
          />
          <Input
            value={filters.q || ''}
            onChange={(e) => setFilters({ ...filters, q: e.target.value || undefined })}
            placeholder="Cari message/type"
            allowClear
          />
          <Button type="primary" onClick={fetchAlarms}>Refresh</Button>
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
          rowKey="id"
          columns={columns as any}
          dataSource={alarms}
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  )
}
