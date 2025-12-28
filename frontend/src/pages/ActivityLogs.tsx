/** AUTO-DOC: src/pages/ActivityLogs.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/ActivityLogs.tsx
 * 
 * Halaman Activity Logs untuk melihat log aktivitas operator
 * 
 * Fungsi:
 * - Menampilkan log aktivitas dengan filter
 * - Filter berdasarkan activity type, entity type, user
 * - Pagination untuk navigasi log
 * - Menampilkan detail setiap aktivitas (user, waktu, deskripsi, IP)
 * 
 * Data yang ditampilkan:
 * - Waktu aktivitas
 * - User yang melakukan aktivitas
 * - Tipe aktivitas (create, update, delete, provision, dll)
 * - Entity yang terpengaruh (OLT, ONU, Alarm, dll)
 * - Deskripsi aktivitas
 * - IP address user
 */

import { useState, useEffect } from 'react'
import { getActivityLogs } from '../services/api'
import type { ActivityLog } from '../types'
import SeverityBadge from '../components/SeverityBadge'

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<{
    skip: number
    limit: number
    activity_type: string
    entity_type: string
    user_id: string
  }>({
    skip: 0,
    limit: 50,
    activity_type: '',
    entity_type: '',
    user_id: ''
  })

  useEffect(() => {
    fetchLogs()
  }, [filters])

  /**
   * Fetch activity logs dari API dengan filter
   */
  const fetchLogs = async () => {
    setLoading(true)
    try {
      const result = await getActivityLogs({
        skip: filters.skip,
        limit: filters.limit,
        activity_type: filters.activity_type || undefined,
        entity_type: filters.entity_type || undefined,
        user_id: filters.user_id ? parseInt(filters.user_id) : undefined
      })
      setLogs(result.logs || [])
      setTotal(result.total || 0)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch activity logs:', error)
      setLoading(false)
    }
  }



  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Logs</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
            <select
              value={filters.activity_type}
              onChange={(e) => setFilters({ ...filters, activity_type: e.target.value, skip: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="provision">Provision</option>
              <option value="reboot">Reboot</option>
              <option value="reset">Reset</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
            <select
              value={filters.entity_type}
              onChange={(e) => setFilters({ ...filters, entity_type: e.target.value, skip: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="olt">OLT</option>
              <option value="onu">ONU</option>
              <option value="alarm">Alarm</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), skip: 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchLogs}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.user?.name || log.user?.email || 'System'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <SeverityBadge value={log.activity_type} kind="activity" size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ip_address || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > filters.limit && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {filters.skip + 1} to {Math.min(filters.skip + filters.limit, total)} of {total} logs
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, skip: Math.max(0, filters.skip - filters.limit) })}
                disabled={filters.skip === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, skip: filters.skip + filters.limit })}
                disabled={filters.skip + filters.limit >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

