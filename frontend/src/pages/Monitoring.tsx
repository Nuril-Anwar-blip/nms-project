/**
 * File: pages/Monitoring.tsx
 * 
 * Halaman Monitoring untuk monitoring real-time OLT dan ONU
 * 
 * Fungsi:
 * - Menampilkan daftar OLT yang tersedia
 * - Memilih OLT untuk dimonitor
 * - Poll OLT untuk mendapatkan status dan performa terbaru
 * - Sync ONU dari OLT ke database
 * - Menampilkan daftar ONU per OLT dengan status dan power levels
 * 
 * Fitur:
 * - Poll OLT: Mengambil data real-time dari OLT via SNMP
 * - Sync ONUs: Sinkronisasi daftar ONU dari OLT ke database
 * - Tabel ONU: Menampilkan serial number, status, RX/TX power
 */

import { useState, useEffect } from 'react'
import { getOlts, pollOlt, syncOnus, getOltOnus } from '../services/api'
import type { Olt, Onu } from '../types'
import StatusBadge from '../components/status/StatusBadge'
import OnuTable from '../components/table/OnuTable'
import StatsCard from '../components/cards/StatsCard'
import CustomButton from '../components/common/CustomButton'

export default function Monitoring() {
  const [olts, setOlts] = useState<Olt[]>([])
  const [selectedOlt, setSelectedOlt] = useState<Olt | null>(null)
  const [onus, setOnus] = useState<Onu[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [polling, setPolling] = useState<boolean>(false)

  useEffect(() => {
    fetchOlts()
  }, [])

  useEffect(() => {
    if (selectedOlt) {
      fetchOnus(selectedOlt.id)
    }
  }, [selectedOlt])

  /**
   * Fetch daftar OLT dari API
   */
  const fetchOlts = async () => {
    try {
      const data = await getOlts()
      setOlts(data)
      if (data.length > 0 && !selectedOlt) {
        setSelectedOlt(data[0])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch OLTs:', error)
      setLoading(false)
    }
  }

  /**
   * Fetch daftar ONU untuk OLT tertentu
   */
  const fetchOnus = async (oltId: number) => {
    try {
      const data = await getOltOnus(oltId)
      setOnus(data)
    } catch (error) {
      console.error('Failed to fetch ONUs:', error)
    }
  }

  /**
   * Poll OLT untuk mendapatkan status dan performa terbaru
   */
  const handlePollOlt = async (oltId: number) => {
    setPolling(true)
    try {
      await pollOlt(oltId)
      await fetchOlts()
      if (selectedOlt?.id === oltId) {
        await fetchOnus(oltId)
      }
      alert('OLT polled successfully')
    } catch (error) {
      alert('Failed to poll OLT: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setPolling(false)
    }
  }

  /**
   * Sync ONU dari OLT ke database
   */
  const handleSyncOnus = async (oltId: number) => {
    setPolling(true)
    try {
      const result = await syncOnus(oltId)
      await fetchOnus(oltId)
      alert(`Synced ${result.synced || 0} ONUs (${result.created || 0} created, ${result.updated || 0} updated)`)
    } catch (error) {
      alert('Failed to sync ONUs: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setPolling(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">OLT Monitoring</h2>
          <div className="flex gap-2">
            {selectedOlt && (
              <>
                <CustomButton
                  onClick={() => handlePollOlt(selectedOlt.id)}
                  loading={polling}
                  disabled={polling}
                >
                  {polling ? 'Polling...' : 'Poll OLT'}
                </CustomButton>
                <CustomButton
                  onClick={() => handleSyncOnus(selectedOlt.id)}
                  loading={polling}
                  disabled={polling}
                  type="primary"
                >
                  {polling ? 'Syncing...' : 'Sync ONUs'}
                </CustomButton>
              </>
            )}
          </div>
        </div>
        {/* Legend untuk status perangkat - membantu operator cepat mengenali warna */}
        <div className="mt-4 px-2">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <StatusBadge status="online" size="sm" />
              <span className="text-xs">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="offline" size="sm" />
              <span className="text-xs">Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="warning" size="sm" />
              <span className="text-xs">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="critical" size="sm" />
              <span className="text-xs">Critical</span>
            </div>
          </div>
        </div>

        {/* OLT Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {olts.map((olt) => (
            <div
              key={olt.id}
              onClick={() => setSelectedOlt(olt)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedOlt?.id === olt.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{olt.name}</h3>
                  <p className="text-sm text-gray-600">{olt.ip_address}</p>
                </div>
                <StatusBadge status={olt.status} size="sm" />
              </div>
              {olt.cpu_usage !== null && (
                <div className="mt-2 text-xs text-gray-600">
                  CPU: {olt.cpu_usage?.toFixed(1) || 'N/A'}% |
                  Memory: {olt.memory_usage?.toFixed(1) || 'N/A'}% |
                  Temp: {olt.temperature?.toFixed(1) || 'N/A'}°C
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ONU Table */}
      {selectedOlt && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            ONUs on {selectedOlt.name}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PON Port</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ONU ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RX Power</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX Power</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {onus.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No ONUs found
                    </td>
                  </tr>
                ) : (
                  onus.map((onu) => (
                    <tr key={onu.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {onu.serial_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onu.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onu.pon_port}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onu.onu_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={onu.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onu.rx_power !== null && onu.rx_power !== undefined ? `${onu.rx_power.toFixed(2)} dBm` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onu.tx_power !== null && onu.tx_power !== undefined ? `${onu.tx_power.toFixed(2)} dBm` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

