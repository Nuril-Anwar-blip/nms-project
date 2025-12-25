/**
 * File: components/Table.tsx
 * 
 * Komponen tabel reusable untuk menampilkan data dalam format tabel
 * 
 * Props:
 * - columns: Array definisi kolom (key, label, render function opsional)
 * - data: Array data yang akan ditampilkan
 * - loading: Boolean untuk menampilkan loading state
 * - emptyMessage: Pesan jika data kosong
 * - onRowClick: Callback ketika row diklik (opsional)
 * 
 * Usage:
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Name' },
 *     { key: 'status', label: 'Status', render: (value) => <Badge>{value}</Badge> }
 *   ]}
 *   data={items}
 *   loading={loading}
 * />
 */

import React from 'react'

export interface TableColumn<T = any> {
  key: string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface TableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  className?: string
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className = ''
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white/60 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}
              >
                {columns.map((column) => {
                  const value = row[column.key]
                  return (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(value, row) : value || '-'}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

