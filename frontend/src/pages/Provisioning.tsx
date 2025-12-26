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

import { useState } from 'react'
import { useOlts } from '../hooks/useOlts'
import { provisionOnu } from '../services/api'
import { Card, Form, Select, Input, InputNumber, Checkbox, Button, message } from 'antd'
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
  const [form] = Form.useForm()

  /**
   * Handle submit form provisioning
   */
  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      const requestData: ProvisionOnuRequest = {
        ...formData,
        pppoe: showPppoe && formData.pppoe ? formData.pppoe : undefined
      }
      await provisionOnu(requestData)
      message.success('Provisioning ONU berhasil')
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
      form.resetFields()
    } catch (error) {
      message.error('Gagal provisioning ONU')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Provision ONU">
        <Form form={form} layout="vertical" className="space-y-6" onFinish={handleSubmit}>
          {/* OLT Selection */}
          <Form.Item label="Select OLT" required validateStatus={!formData.olt_id ? 'error' : ''} help={!formData.olt_id ? 'Pilih OLT' : ''}>
            <Select
              value={formData.olt_id || undefined}
              onChange={(v) => setFormData({ ...formData, olt_id: v })}
              placeholder="Pilih OLT"
              options={[
                ...olts.map(olt => ({
                  value: olt.id,
                  label: `${olt.name} (${olt.ip_address}) - ${olt.status}`
                }))
              ]}
            />
          </Form.Item>

          {/* PON Port and ONU ID */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="PON Port" required>
              <InputNumber min={1} max={16} style={{ width: '100%' }} value={formData.pon_port} onChange={(v) => setFormData({ ...formData, pon_port: Number(v) })} />
            </Form.Item>
            <Form.Item label="ONU ID" required>
              <InputNumber min={1} max={64} style={{ width: '100%' }} value={formData.onu_id} onChange={(v) => setFormData({ ...formData, onu_id: Number(v) })} />
            </Form.Item>
          </div>

          {/* Serial Number */}
          <Form.Item label="Serial Number" required>
            <Input value={formData.serial_number} onChange={(e) => setFormData({ ...formData, serial_number: e.target.value.toUpperCase() })} placeholder="ZTEGC12345678" />
          </Form.Item>

          {/* Name and Model */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="ONU Name">
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Customer-001" />
            </Form.Item>
            <Form.Item label="Model">
              <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="F601" />
            </Form.Item>
          </div>

          {/* PPPoE Account (Optional) */}
          <div>
            <Checkbox
              checked={showPppoe}
              onChange={(e) => {
                const checked = e.target.checked
                setShowPppoe(checked)
                if (!checked) {
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
            >
              Create PPPoE Account
            </Checkbox>

            {showPppoe && formData.pppoe && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Form.Item label="Username" required>
                      <Input
                        value={formData.pppoe.username}
                        onChange={(e) => setFormData({
                          ...formData,
                          pppoe: { ...formData.pppoe!, username: e.target.value }
                        })}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item label="Password" required>
                      <Input.Password
                        value={formData.pppoe.password}
                        onChange={(e) => setFormData({
                          ...formData,
                          pppoe: { ...formData.pppoe!, password: e.target.value }
                        })}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div>
                  <Form.Item label="VLAN ID">
                    <Input
                      value={formData.pppoe.vlan_id || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        pppoe: { ...formData.pppoe!, vlan_id: e.target.value }
                      })}
                      placeholder="100"
                    />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Form.Item label="Download Speed (bps)">
                      <InputNumber
                        style={{ width: '100%' }}
                        value={formData.pppoe.download_speed || 0}
                        onChange={(v) => setFormData({
                          ...formData,
                          pppoe: { ...formData.pppoe!, download_speed: Number(v) || 0 }
                        })}
                        placeholder="100000000"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item label="Upload Speed (bps)">
                      <InputNumber
                        style={{ width: '100%' }}
                        value={formData.pppoe.upload_speed || 0}
                        onChange={(v) => setFormData({
                          ...formData,
                          pppoe: { ...formData.pppoe!, upload_speed: Number(v) || 0 }
                        })}
                        placeholder="50000000"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading}>
              Provision ONU
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
