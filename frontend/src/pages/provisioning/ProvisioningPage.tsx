/** AUTO-DOC: src/pages/provisioning/ProvisioningPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/provisioning/ProvisioningPage.tsx
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
import { useOlts } from '../../hooks/useOlts'
import { provisionOnu } from '../../services/api'
import CustomButton from '../../components/common/CustomButton'
import { Card, Form, Select, Input, InputNumber, Checkbox, Button, message } from 'antd'
import type { ProvisionOnuRequest } from '../../types'

export default function ProvisioningPage() {
    const { olts } = useOlts()
    const [formData, setFormData] = useState<ProvisionOnuRequest>({
        olt_id: 0,
        serial_number: '',
        pon_port: 1,
        onu_id: 1,
        name: '',
        service_profile: 'default',
        vlan_id: 1,
        create_pppoe_account: false,
        pppoe_username: '',
        pppoe_password: ''
    })
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async (values: any) => {
        setLoading(true)
        try {
            await provisionOnu(values)
            message.success('ONU provisioned successfully')
            // Reset form
            setFormData({
                olt_id: 0,
                serial_number: '',
                pon_port: 1,
                onu_id: 1,
                name: '',
                service_profile: 'default',
                vlan_id: 1,
                create_pppoe_account: false,
                pppoe_username: '',
                pppoe_password: ''
            })
        } catch (error) {
            message.error('Failed to provision ONU: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Provisioning ONU</h2>

                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={formData}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* OLT Selection */}
                        <Form.Item
                            label="OLT"
                            name="olt_id"
                            rules={[{ required: true, message: 'Please select OLT' }]}
                        >
                            <Select
                                placeholder="Select OLT"
                                onChange={(value) => setFormData({ ...formData, olt_id: value })}
                            >
                                {olts.map((olt) => (
                                    <Select.Option key={olt.id} value={olt.id}>
                                        {olt.name} ({olt.ip_address})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Serial Number */}
                        <Form.Item
                            label="Serial Number"
                            name="serial_number"
                            rules={[{ required: true, message: 'Please enter serial number' }]}
                        >
                            <Input
                                placeholder="e.g. ZTEG12345678"
                                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            />
                        </Form.Item>

                        {/* PON Port */}
                        <Form.Item
                            label="PON Port"
                            name="pon_port"
                            rules={[{ required: true, message: 'Please enter PON port' }]}
                        >
                            <InputNumber
                                min={1}
                                max={16}
                                placeholder="1-16"
                                onChange={(value) => setFormData({ ...formData, pon_port: value || 1 })}
                            />
                        </Form.Item>

                        {/* ONU ID */}
                        <Form.Item
                            label="ONU ID"
                            name="onu_id"
                            rules={[{ required: true, message: 'Please enter ONU ID' }]}
                        >
                            <InputNumber
                                min={1}
                                max={64}
                                placeholder="1-64"
                                onChange={(value) => setFormData({ ...formData, onu_id: value || 1 })}
                            />
                        </Form.Item>

                        {/* ONU Name */}
                        <Form.Item
                            label="ONU Name"
                            name="name"
                        >
                            <Input
                                placeholder="Optional ONU name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Item>

                        {/* Service Profile */}
                        <Form.Item
                            label="Service Profile"
                            name="service_profile"
                        >
                            <Select
                                defaultValue="default"
                                onChange={(value) => setFormData({ ...formData, service_profile: value })}
                            >
                                <Select.Option value="default">Default</Select.Option>
                                <Select.Option value="basic">Basic</Select.Option>
                                <Select.Option value="premium">Premium</Select.Option>
                            </Select>
                        </Form.Item>

                        {/* VLAN ID */}
                        <Form.Item
                            label="VLAN ID"
                            name="vlan_id"
                        >
                            <InputNumber
                                min={1}
                                max={4094}
                                placeholder="1-4094"
                                onChange={(value) => setFormData({ ...formData, vlan_id: value || 1 })}
                            />
                        </Form.Item>
                    </div>

                    {/* PPPoE Account Section */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <Form.Item
                            name="create_pppoe_account"
                            valuePropName="checked"
                        >
                            <Checkbox
                                onChange={(e) => setFormData({ ...formData, create_pppoe_account: e.target.checked })}
                            >
                                Create PPPoE Account
                            </Checkbox>
                        </Form.Item>

                        {formData.create_pppoe_account && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <Form.Item
                                    label="PPPoE Username"
                                    name="pppoe_username"
                                    rules={[{ required: true, message: 'Please enter PPPoE username' }]}
                                >
                                    <Input
                                        placeholder="username"
                                        onChange={(e) => setFormData({ ...formData, pppoe_username: e.target.value })}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="PPPoE Password"
                                    name="pppoe_password"
                                    rules={[{ required: true, message: 'Please enter PPPoE password' }]}
                                >
                                    <Input.Password
                                        placeholder="password"
                                        onChange={(e) => setFormData({ ...formData, pppoe_password: e.target.value })}
                                    />
                                </Form.Item>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <CustomButton
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={loading}
                        >
                            Provision ONU
                        </CustomButton>
                    </div>
                </Form>
            </div>
        </div>
    )
}
