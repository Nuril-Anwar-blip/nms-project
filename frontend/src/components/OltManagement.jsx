/**
 * OLT Management Component dengan Layout Modern
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah card style: Edit className di card container
 * - Ubah table style: Edit className di table
 * - Ubah modal: Edit style di OltModal
 * - Tambah filter: Tambah input/search di header
 */
import { useState, useEffect } from 'react'

export default function OltManagement({ apiBase }) {
    const [olts, setOlts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingOlt, setEditingOlt] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchOlts()
    }, [])

    const fetchOlts = async () => {
        try {
            const res = await fetch(`${apiBase}/olts`)
            const data = await res.json()
            setOlts(data)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch OLTs:', error)
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this OLT?')) return

        try {
            await fetch(`${apiBase}/olts/${id}`, { method: 'DELETE' })
            fetchOlts()
        } catch (error) {
            console.error('Failed to delete OLT:', error)
            alert('Failed to delete OLT')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)

        try {
            const url = editingOlt ? `${apiBase}/olts/${editingOlt.id}` : `${apiBase}/olts`
            const method = editingOlt ? 'PUT' : 'POST'

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            setShowModal(false)
            setEditingOlt(null)
            fetchOlts()
        } catch (error) {
            console.error('Failed to save OLT:', error)
            alert('Failed to save OLT')
        }
    }

    const statusColors = {
        online: 'bg-green-100 text-green-800 border-green-300',
        offline: 'bg-red-100 text-red-800 border-red-300',
        unknown: 'bg-gray-100 text-gray-800 border-gray-300',
    }

    const filteredOlts = olts.filter(olt =>
        olt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        olt.ip_address.includes(searchTerm)
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Loading OLTs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header dengan Search - Ubah style header di sini */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">OLT Management</h2>
                    <p className="text-gray-600 mt-1">Manage and monitor your OLT devices</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    {/* Search Box - Ubah style search di sini */}
                    <div className="flex-1 sm:flex-initial relative">
                        <input
                            type="text"
                            placeholder="Search OLTs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                    <button
                        onClick={() => {
                            setEditingOlt(null)
                            setShowModal(true)
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        + Add OLT
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">Total OLTs</div>
                    <div className="text-2xl font-bold text-blue-600">{olts.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="text-sm text-gray-600 mb-1">Online</div>
                    <div className="text-2xl font-bold text-green-600">
                        {olts.filter(o => o.status === 'online').length}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                    <div className="text-sm text-gray-600 mb-1">Offline</div>
                    <div className="text-2xl font-bold text-red-600">
                        {olts.filter(o => o.status === 'offline').length}
                    </div>
                </div>
            </div>

            {/* Table dengan Card Style - Ubah style table di sini */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IP Address</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Model</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ONUs</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOlts.map((olt) => (
                                <tr key={olt.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                                                {olt.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{olt.name}</div>
                                                {olt.location && (
                                                    <div className="text-xs text-gray-500">{olt.location}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{olt.ip_address}</code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{olt.model || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[olt.status] || statusColors.unknown}`}>
                                            {olt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{olt.onus_count || 0}</span>
                                            <span className="text-gray-400">ONUs</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingOlt(olt)
                                                    setShowModal(true)
                                                }}
                                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(olt.id)}
                                                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOlts.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-600 font-medium">No OLTs found</p>
                        <p className="text-sm text-gray-500 mt-2">Try adjusting your search</p>
                    </div>
                )}
            </div>

            {/* Modal - Ubah style modal di sini */}
            {showModal && (
                <OltModal
                    olt={editingOlt}
                    onClose={() => {
                        setShowModal(false)
                        setEditingOlt(null)
                    }}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    )
}

function OltModal({ olt, onClose, onSubmit }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{olt ? 'Edit OLT' : 'Add New OLT'}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={olt?.name}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="OLT Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">IP Address *</label>
                            <input
                                type="text"
                                name="ip_address"
                                defaultValue={olt?.ip_address}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="192.168.1.1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                            <input
                                type="text"
                                name="model"
                                defaultValue={olt?.model}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="C300 / C320"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">SNMP Community *</label>
                            <input
                                type="text"
                                name="snmp_community"
                                defaultValue={olt?.snmp_community || 'public'}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">SNMP Version</label>
                            <select
                                name="snmp_version"
                                defaultValue={olt?.snmp_version || 2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                <option value={1}>SNMPv1</option>
                                <option value={2}>SNMPv2c</option>
                                <option value={3}>SNMPv3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                defaultValue={olt?.location}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Location"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg transition-all"
                        >
                            {olt ? 'Update OLT' : 'Create OLT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
