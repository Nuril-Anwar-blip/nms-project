/** AUTO-DOC: src/pages/auth/RegisterPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/auth/RegisterPage.tsx
 * 
 * Halaman Register untuk pendaftaran user baru NMS
 * 
 * Fungsi:
 * - Form registrasi user baru
 * - Validasi input user
 * - Password confirmation
 * - Handle registration process
 * - Redirect ke login setelah registrasi berhasil
 * 
 * Fitur:
 * - Form validation
 * - Password strength indicator
 * - Terms and conditions checkbox
 * - Link ke halaman login
 * - Loading state saat registrasi
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, Alert, Typography, Select } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import CustomButton from '../../components/common/CustomButton'
import { registerUser } from '../../services/api'
import { useAuth } from '../../hooks'
import AuthCard from '../../components/common/AuthCard'

const { Text } = Typography

/**
 * Halaman Register (`RegisterPage`)
 *
 * Deskripsi:
 * Halaman pendaftaran user baru untuk NMS. Menyediakan form pembuatan akun
 * dengan validasi (nama, email, password, konfirmasi password) dan persetujuan
 * Syarat & Ketentuan. Setelah berhasil mendaftar, pengguna akan diarahkan ke
 * halaman login (`/login`).
 *
 * Integrasi Backend:
 * - Endpoint: `POST /api/auth/register`
 * - Payload yang dikirim: { name, email, password, role? }
 * - Perhatian: Saat ini API backend membatasi pembuatan user hanya untuk
 *   administrator yang sudah terautentikasi; oleh karena itu form pendaftaran
 *   hanya ditampilkan jika user sekarang adalah `admin`. Jika tidak, halaman
 *   akan menampilkan informasi bahwa pendaftaran harus dilakukan oleh admin.
 *
 * Behaviour / Alur:
 * 1. Administrator mengisi form dan submit.
 * 2. Frontend memanggil `registerUser(payload)` di `services/api.ts`.
 * 3. Jika sukses => redirect ke `/login`; jika gagal => tampilkan pesan error.
 *
 * Komponen terkait:
 * - `AuthCard`: wrapper kartu konsisten untuk halaman autentikasi
 * - `CustomButton`: tombol kustom dengan styling konsisten
 */
export default function RegisterPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleSubmit = async (values: any) => {
        setLoading(true)
        setError(null)

        try {
            // Panggil API pendaftaran
            const payload: any = {
                name: values.name,
                email: values.email,
                password: values.password,
            }
            if (values.role) payload.role = values.role

            await registerUser(payload)
            // Jika API mengembalikan error, handleResponse akan melempar exception
            // Sukses -> redirect ke login
            navigate('/login')
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Pendaftaran gagal. Silakan coba lagi.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <AuthCard title="Buat Akun" subtitle="Daftar ke NMS ZTE OLT">
                {error && (
                    <Alert
                        message={error}
                        type="error"
                        className="mb-4"
                        closable
                        onClose={() => setError(null)}
                    />
                )}

                {(!user || user.role !== 'admin') ? (
                    <Alert type="info" showIcon message="Pendaftaran hanya dapat dilakukan oleh administrator yang sudah login. Silakan login sebagai administrator untuk membuat akun baru." />
                ) : (
                    <Form
                        form={form}
                        name="register"
                        onFinish={handleSubmit}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Masukkan nama lengkap!' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nama Lengkap"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Masukkan email!' },
                                { type: 'email', message: 'Masukkan email yang valid!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email"
                            />
                        </Form.Item>

                        {/* Username is not required by backend; backend expects name, email, password, role */}

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Masukkan password!' },
                                { min: 6, message: 'Password minimal 6 karakter!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Konfirmasi password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(new Error('Password tidak cocok'))
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Konfirmasi Password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value ? Promise.resolve() : Promise.reject(new Error('Anda harus menyetujui syarat dan ketentuan')),
                                },
                            ]}
                        >
                            <Checkbox>
                                Saya setuju dengan <a href="#">Syarat dan Ketentuan</a>
                            </Checkbox>
                        </Form.Item>

                        {/* Role selection: only visible when current user is admin */}
                        {user && user.role === 'admin' && (
                            <Form.Item name="role" label="Role" initialValue="operator">
                                <Select>
                                    <Select.Option value="admin">Administrator</Select.Option>
                                    <Select.Option value="operator">Operator</Select.Option>
                                </Select>
                            </Form.Item>
                        )}

                        <Form.Item>
                            <CustomButton
                                htmlType="submit"
                                type="primary"
                                loading={loading}
                                disabled={loading}
                                className="w-full"
                            >
                                Daftar
                            </CustomButton>
                        </Form.Item>

                        <div className="text-center">
                            <Text className="text-gray-600">
                                Sudah punya akun?{' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                                    Masuk
                                </Link>
                            </Text>
                        </div>
                    </Form>
                )}
            </AuthCard>
        </div>
    )
}
