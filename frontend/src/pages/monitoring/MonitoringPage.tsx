/**
 * File: pages/monitoring/MonitoringPage.tsx
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
import { getOlts, pollOlt, syncOnus, getOltOnus } from '../../services/api'
import type { Olt, Onu } from '../../types'
import StatusBadge from '../../components/status/StatusBadge'
import OnuTable from '../../components/table/OnuTable'
import StatsCard from '../../components/cards/StatsCard'
import CustomButton from '../../components/common/CustomButton'

export default function MonitoringPage() {
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

    const fetchOlts = async () => {
        try {
            const data = await getOlts()
            setOlts(data)
            if (data.length > 0 && !selectedOlt) {
                setSelectedOlt(data[0])
            }
        } catch (error) {
            console.error('Failed to fetch OLTs:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchOnus = async (oltId: number) => {
        try {
            const data = await getOltOnus(oltId)
            setOnus(data)
        } catch (error) {
            console.error('Failed to fetch ONUs:', error)
        }
    }

    const handlePollOlt = async (oltId: number) => {
        setPolling(true)
        try {
            await pollOlt(oltId)
            alert('OLT polled successfully')
            fetchOlts()
            if (selectedOlt?.id === oltId) {
                fetchOnus(oltId)
            }
        } catch (error) {
            alert('Failed to poll OLT: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setPolling(false)
        }
    }

    const handleSyncOnus = async (oltId: number) => {
        setPolling(true)
        try {
            const result = await syncOnus(oltId)
            alert(`Synced ${result.synced || 0} ONUs (${result.created || 0} created, ${result.updated || 0} updated)`)
            if (selectedOlt?.id === oltId) {
                fetchOnus(oltId)
            }
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

                {/* OLT Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select OLT
                    </label>
                    <select
                        value={selectedOlt?.id || ''}
                        onChange={(e) => {
                            const olt = olts.find(o => o.id === parseInt(e.target.value))
                            setSelectedOlt(olt || null)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {olts.map((olt) => (
                            <option key={olt.id} value={olt.id}>
                                {olt.name} ({olt.ip_address})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Legend */}
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
                    </div>
                </div>
            </div>

            {/* ONU Table */}
            {selectedOlt && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ONUs for {selectedOlt.name}
                    </h3>
                    <OnuTable
                        data={onus}
                        loading={polling}
                        onEdit={(onu) => console.log('Edit ONU:', onu)}
                        onDelete={(onu) => console.log('Delete ONU:', onu)}
                        onReboot={(onu) => console.log('Reboot ONU:', onu)}
                    />
                </div>
            )}
        </div>
    )
}
