/**
 * File: pages/Provisioning.tsx
 * 
 * Halaman provisioning ONU untuk menambah ONU baru dengan konfigurasi lengkap
 * 
 * Fungsi:
 * - Form untuk provisioning ONU baru
 * - Pemilihan OLT dan PON port
 * - Input serial number ONU
 * - Penamaan ONU dan service profile
 * - Pembuatan akun PPPoE secara langsung saat provisioning
 * 
 * Alur kerja:
 * 1. User memilih OLT dari dropdown
 * 2. User memilih PON port (1-16 biasanya)
 * 3. User input serial number ONU
 * 4. User input ONU ID (1-64 per PON port)
 * 5. User input nama ONU (opsional)
 * 6. User dapat membuat akun PPPoE langsung (opsional)
 * 7. Submit form -> API provisioning -> ONU dibuat di OLT dan database
 * 
 * Validasi:
 * - Serial number harus unik
 * - ONU ID harus unik dalam PON port yang sama
 * - OLT harus online untuk provisioning
 */

import { useState, useEffect } from 'react'
import { useOlts } from '../hooks/useOlts'
import { provisionOnu } from '../services/api'
import Card from '../components/Card'
import type { ProvisionOnuRequest } from '../types'

export default function Provisioning() {
  const { olts } = useOlts()
  const [formData, setFormData] = useState<ProvisionOnuRequest>({
    olt_id: 0,
    serial_number: '',
    pon_port: 1,
    onu_id: 1,
    name: '',
    model: '',
    pppoe: undefined
  })
  const [showPppoe, setShowPppoe] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Handle submit form provisioning
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.olt_id) {
      alert('Please select an OLT')
      return
    }

    if (!formData.serial_number.trim()) {
      alert('Please enter serial number')
      return
    }

    setLoading(true)
    try {
      // Jika tidak ada PPPoE, hapus dari request
      const requestData: ProvisionOnuRequest = {
        ...formData,
        pppoe: showPppoe && formData.pppoe ? formData.pppoe : undefined
      }
      
      await provisionOnu(requestData)
      alert('ONU provisioned successfully!')
      
      // Reset form
      setFormData({
        olt_id: 0,
        serial_number: '',
        pon_port: 1,
        onu_id: 1,
        name: '',
        model: '',
        pppoe: undefined
      })
      setShowPppoe(false)
    } catch (error) {
      alert('Failed to provision ONU: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Provision ONU">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OLT Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select OLT *
            </label>
            <select
              required
              value={formData.olt_id}
              onChange={(e) => setFormData({ ...formData, olt_id: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Select OLT</option>
              {olts.map(olt => (
                <option key={olt.id} value={olt.id}>
                  {olt.name} ({olt.ip_address}) - {olt.status}
                </option>
              ))}
            </select>
          </div>

          {/* PON Port and ONU ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PON Port *
              </label>
              <input
                type="number"
                required
                min="1"
                max="16"
                value={formData.pon_port}
                onChange={(e) => setFormData({ ...formData, pon_port: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ONU ID *
              </label>
              <input
                type="number"
                required
                min="1"
                max="64"
                value={formData.onu_id}
                onChange={(e) => setFormData({ ...formData, onu_id: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serial Number *
            </label>
            <input
              type="text"
              required
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ZTEGC12345678"
            />
            <p className="mt-1 text-xs text-gray-500">Enter ONU serial number (usually on the device label)</p>
          </div>

          {/* Name and Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ONU Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Customer-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="F601"
              />
            </div>
          </div>

          {/* PPPoE Account (Optional) */}
          <div>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={showPppoe}
                onChange={(e) => {
                  setShowPppoe(e.target.checked)
                  if (!e.target.checked) {
                    setFormData({ ...formData, pppoe: undefined })
                  } else {
                    setFormData({
                      ...formData,
                      pppoe: {
                        username: '',
                        password: '',
                        vlan_id: '',
                        download_speed: 0,
                        upload_speed: 0
                      }
                    })
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Create PPPoE Account</span>
            </label>

            {showPppoe && formData.pppoe && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      required={showPppoe}
                      value={formData.pppoe.username}
                      onChange={(e) => setFormData({
                        ...formData,
                        pppoe: { ...formData.pppoe!, username: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      required={showPppoe}
                      value={formData.pppoe.password}
                      onChange={(e) => setFormData({
                        ...formData,
                        pppoe: { ...formData.pppoe!, password: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VLAN ID
                  </label>
                  <input
                    type="text"
                    value={formData.pppoe.vlan_id || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      pppoe: { ...formData.pppoe!, vlan_id: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Download Speed (bps)
                    </label>
                    <input
                      type="number"
                      value={formData.pppoe.download_speed || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        pppoe: { ...formData.pppoe!, download_speed: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="100000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Speed (bps)
                    </label>
                    <input
                      type="number"
                      value={formData.pppoe.upload_speed || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        pppoe: { ...formData.pppoe!, upload_speed: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="50000000"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Provisioning...' : 'Provision ONU'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
