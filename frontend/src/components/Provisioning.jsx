/**
 * Provisioning Component
 * 
 * Halaman untuk provisioning ONU dengan opsi PPPoE
 * 
 * PROPS:
 * - apiBase: string - Base URL untuk API
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah form layout: Edit grid columns (grid-cols-2)
 * - Tambah field: Duplikat div dengan input untuk field baru
 * - Ubah warna form: Edit className di card (bg-white, shadow)
 * - Ubah button style: Edit className button
 * - Ubah PPPoE section: Edit style di conditional rendering
 */
import { useState, useEffect } from 'react'

export default function Provisioning({ apiBase }) {
    const [olts, setOlts] = useState([])
    const [selectedOlt, setSelectedOlt] = useState('')
    const [formData, setFormData] = useState({
        serial_number: '',
        pon_port: '',
        onu_id: '',
        name: '',
        create_pppoe: false,
        pppoe_username: '',
        pppoe_password: '',
        pppoe_vlan: '',
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchOlts()
    }, [])

    const fetchOlts = async () => {
        try {
            const res = await fetch(`${apiBase}/olts`)
            const data = await res.json()
            setOlts(data)
            if (data.length > 0 && !selectedOlt) {
                setSelectedOlt(data[0].id)
            }
        } catch (error) {
            console.error('Failed to fetch OLTs:', error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                olt_id: selectedOlt,
                serial_number: formData.serial_number,
                pon_port: parseInt(formData.pon_port),
                onu_id: parseInt(formData.onu_id),
                name: formData.name || null,
            }

            if (formData.create_pppoe) {
                payload.pppoe = {
                    username: formData.pppoe_username,
                    password: formData.pppoe_password,
                    vlan_id: formData.pppoe_vlan || null,
                }
            }

            const res = await fetch(`${apiBase}/provisioning/onu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                alert('ONU provisioned successfully!')
                setFormData({
                    serial_number: '',
                    pon_port: '',
                    onu_id: '',
                    name: '',
                    create_pppoe: false,
                    pppoe_username: '',
                    pppoe_password: '',
                    pppoe_vlan: '',
                })
            } else {
                const error = await res.json()
                alert(`Failed to provision ONU: ${error.message || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Provisioning error:', error)
            alert('Failed to provision ONU')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">ONU Provisioning</h2>

            {/* Form Card - Ubah style card di sini */}
            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* OLT Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OLT</label>
                        <select
                            value={selectedOlt}
                            onChange={(e) => setSelectedOlt(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Select OLT</option>
                            {olts.map((olt) => (
                                <option key={olt.id} value={olt.id}>
                                    {olt.name} ({olt.ip_address})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Serial Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                        <input
                            type="text"
                            value={formData.serial_number}
                            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="ZTEG12345678"
                        />
                    </div>

                    {/* Grid Layout - Ubah grid columns di sini */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">PON Port</label>
                            <input
                                type="number"
                                value={formData.pon_port}
                                onChange={(e) => setFormData({ ...formData, pon_port: e.target.value })}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ONU ID</label>
                            <input
                                type="number"
                                value={formData.onu_id}
                                onChange={(e) => setFormData({ ...formData, onu_id: e.target.value })}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name (Optional)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Customer Name"
                        />
                    </div>

                    {/* PPPoE Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="create_pppoe"
                            checked={formData.create_pppoe}
                            onChange={(e) => setFormData({ ...formData, create_pppoe: e.target.checked })}
                            className="mr-2"
                        />
                        <label htmlFor="create_pppoe" className="text-sm font-medium text-gray-700">
                            Create PPPoE Account
                        </label>
                    </div>

                    {/* PPPoE Fields - Ubah style section ini */}
                    {formData.create_pppoe && (
                        <div className="pl-6 border-l-2 border-blue-500 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PPPoE Username</label>
                                <input
                                    type="text"
                                    value={formData.pppoe_username}
                                    onChange={(e) => setFormData({ ...formData, pppoe_username: e.target.value })}
                                    required={formData.create_pppoe}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PPPoE Password</label>
                                <input
                                    type="password"
                                    value={formData.pppoe_password}
                                    onChange={(e) => setFormData({ ...formData, pppoe_password: e.target.value })}
                                    required={formData.create_pppoe}
                                    minLength="6"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">VLAN ID (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.pppoe_vlan}
                                    onChange={(e) => setFormData({ ...formData, pppoe_vlan: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button - Ubah style button di sini */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Provisioning...' : 'Provision ONU'}
                    </button>
                </form>
            </div>
        </div>
    )
}
