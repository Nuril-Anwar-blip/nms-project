/** AUTO-DOC: src/pages/auth/LoginPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/auth/LoginPage.tsx
 * 
 * Halaman Login untuk autentikasi user ke NMS
 * 
 * Fungsi:
 * - Form login dengan username dan password
 * - Validasi input user
 * - Handle login process
 * - Redirect ke dashboard setelah login berhasil
 * - Error handling untuk login gagal
 * 
 * Fitur:
 * - Remember me checkbox
 * - Forgot password link
 * - Link ke halaman register
 * - Loading state saat login
 * 
 * Backend Integration:
 * - Menggunakan useAuth hook untuk login
 * - Token JWT disimpan di localStorage
 * - User data disimpan untuk session
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, Alert, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks'
import CustomButton from '../../components/common/CustomButton'
import AuthCard from '../../components/common/AuthCard'

const { Text } = Typography

/**
 * Halaman Login (`LoginPage`)
 *
 * Deskripsi:
 * Halaman ini menampilkan form login yang meminta `username` (atau email)
 * dan `password`. Saat form disubmit, fungsi `handleSubmit` memanggil
 * `login(username, password)` dari `useAuth`.
 *
 * Behaviour / Alur:
 * 1. User memasukkan credential (username/email + password) lalu submit.
 * 2. `useAuth.login` akan mengirim request ke backend dan menyimpan token
 *    serta data user di `localStorage` jika berhasil.
 * 3. Jika login sukses -> pengguna diarahkan ke `/dashboard`.
 * 4. Jika login gagal -> pesan error ditampilkan di atas form.
 *
 * Komponen terkait:
 * - `AuthCard`: wrapper ulang-pakai untuk tampilan kartu autentikasi
 * - `CustomButton`: tombol kustom yang mendukung `htmlType="submit"`
 */
export default function LoginPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { login, error: authError } = useAuth()
    const navigate = useNavigate()

    /**
     * Handle submit form login
     * useAuth.login dari `hooks/auth/useAuth.ts` menerima dua argumen: (username, password)
     */
    const handleSubmit = async (values: any) => {
        setLoading(true)
        setError(null)
        try {
            const success = await login(values.username, values.password)
            if (success) {
                navigate('/dashboard')
            } else {
                setError(authError || 'Login gagal. Periksa username dan password.')
            }
        } catch (err: any) {
            const msg = err?.message || 'Login gagal. Periksa koneksi atau server.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <AuthCard title="NMS ZTE OLT" subtitle="Network Management System">
                {error && (
                    <Alert
                        message={error}
                        type="error"
                        className="mb-4"
                        closable
                        onClose={() => setError(null)}
                    />
                )}

                <Form
                    form={form}
                    name="login"
                    onFinish={handleSubmit}
                    layout="vertical"
                    size="large"
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Masukkan username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Masukkan password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                                Forgot password?
                            </Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <CustomButton htmlType="submit" type="primary" loading={loading} disabled={loading} className="w-full">
                            Sign In
                        </CustomButton>
                    </Form.Item>

                    <div className="text-center">
                        <Text className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:text-blue-800">
                                Sign up
                            </Link>
                        </Text>
                    </div>
                </Form>
            </AuthCard>
        </div>
    )
}
