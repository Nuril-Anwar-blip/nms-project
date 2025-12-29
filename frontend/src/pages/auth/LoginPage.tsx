/**
 * File: src/pages/auth/LoginPage.tsx
 *
 * Halaman Login
 * - Menampilkan form login (username + password)
 * - Memanggil `useAuth().login` untuk autentikasi
 * - Menyediakan dua pilihan tema (Tema Terang / Tema Gelap)
 *
 * Dokumentasi singkat (Bahasa Indonesia):
 * Komponen ini menggunakan Ant Design `Form` untuk validasi dan `AuthCard`
 * sebagai container. Preferensi tema disimpan ke `localStorage`.
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, Alert, Typography } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks'
import CustomButton from '../../components/common/CustomButton'
import { colors } from '../../lib/utils/colors'

const { Text } = Typography

/**
 * Komponen: LoginPage
 * Deskripsi:
 * - Menampilkan halaman login dua kolom (hero kiri, form kanan).
 * - Menyediakan toggle tema (light / dark) yang disimpan di `localStorage`.
 * - Menggunakan Ant Design `Form` untuk validasi dan komponen UI.
 * - Memanggil `useAuth().login` untuk autentikasi dan redirect ke `/dashboard`.
 */
export default function LoginPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { login, error: authError } = useAuth()
    const navigate = useNavigate()

    /**
     * State: theme
     * - Menyimpan preferensi tema pengguna: 'light' atau 'dark'.
     * - Default dibaca dari `localStorage` jika tersedia.
     */
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'))

    /**
     * Effect: persist tema
     * - Menyimpan preferensi tema ke `localStorage` setiap kali `theme` berubah.
     * - Menangani error (contoh: mode private browsing) dengan mengabaikan exception.
     */
    useEffect(() => {
        try {
            localStorage.setItem('theme', theme)
        } catch (e) {
            // Jika penyimpanan gagal (contoh: Private mode), tetap lanjutkan tanpa crash
        }
    }, [theme])

    /**
     * Konstanta: heroGradient
     * - Gradient yang digunakan pada area hero kiri.
     * - Mengambil warna dari token `colors` agar mudah dikustomisasi.
     */
    const heroGradient = `linear-gradient(135deg, ${colors.heroStart} 0%, ${colors.heroEnd} 100%)`

    /**
     * Handler: handleSubmit
     * - Dipanggil saat form login disubmit.
     * - Memanggil `login(username, password)` dari `useAuth()`.
     * - Jika berhasil: redirect ke `/dashboard`, jika gagal: set error message.
     */
    const handleSubmit = async (values: any) => {
        setLoading(true)
        setError(null)
        try {
            const success = await login(values.username, values.password)
            if (success) navigate('/dashboard')
            else setError(authError || 'Login gagal. Periksa username dan password.')
        } catch (err: any) {
            setError(err?.message || 'Login gagal. Periksa koneksi atau server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: theme === 'dark' ? '#071026' : '#f3f7fb' }}>
            {/* Theme toggle top-right */}
            <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full border flex items-center justify-center bg-white/80"
                style={{ boxShadow: '0 2px 6px rgba(2,6,23,0.2)' }}
            >
                {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            </button>

            <div className="w-full max-w-6xl rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
                {/* Left - Hero */}
                <div className="hidden md:flex items-center justify-center p-12" style={{ background: heroGradient }}>
                    {/*
                        Bagian Hero (kiri) - menampilkan ilustrasi, judul, dan poin fitur.
                        - Hanya ditampilkan pada layar md ke atas.
                        - Warna dan gradient diambil dari token `colors`.
                    */}
                    <div className="text-center text-white max-w-sm">
                        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-white/10 flex items-center justify-center" style={{ boxShadow: 'inset 0 0 40px rgba(255,255,255,0.02)' }}>
                            <div className="text-3xl" style={{ color: colors.primary }}>⚙️</div>
                        </div>

                        <h2 className="text-3xl font-extrabold mb-2" style={{ color: colors.primary }}>NMS Zetset</h2>
                        <p className="text-sm text-white/80">Manage your network infrastructure with ease and efficiency</p>

                        <div className="mt-8 text-sm text-white/70 space-y-2">
                            <p>• Real-time monitoring</p>
                            <p>• Easy provisioning</p>
                            <p>• Scalable device management</p>
                        </div>
                    </div>
                </div>

                {/* Right - Form card */}
                <div className="flex items-center justify-center p-8" style={{ background: theme === 'dark' ? '#0b1220' : '#ffffff' }}>
                    {/*
                        Bagian Form (kanan) - menampilkan judul, form login, dan tautan.
                        - Menggunakan Ant Design Form untuk validasi.
                        - Menangani tampilan error melalui `Alert`.
                    */}
                    <div className="w-full max-w-md">
                        {error && <Alert message={error} type="error" className="mb-4" closable onClose={() => setError(null)} />}

                        <div className="mb-6 text-center">
                            <h1 className="text-3xl font-extrabold" style={{ color: theme === 'dark' ? '#e6eef8' : '#0f172a' }}>Welcome Back</h1>
                            <p className="text-sm mt-2 text-gray-500">Sign in to your account to continue</p>
                        </div>

                        <Form form={form} name="login" onFinish={handleSubmit} layout="vertical" size="large" initialValues={{ remember: true }}>
                            <Form.Item name="username" rules={[{ required: true, message: 'Masukkan username!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Enter your username" className="rounded-md" />
                            </Form.Item>

                            <Form.Item name="password" rules={[{ required: true, message: 'Masukkan password!' }]}>
                                <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" className="rounded-md" />
                            </Form.Item>

                            <Form.Item>
                                <div className="flex items-center justify-between">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>
                                    <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <CustomButton htmlType="submit" type="primary" loading={loading} disabled={loading} className="w-full flex items-center justify-center" style={{ background: colors.primary, borderColor: colors.primary }}>
                                    <LoginOutlined className="mr-2" /> Sign In
                                </CustomButton>
                            </Form.Item>

                            <div className="text-center">
                                <Text className="text-gray-500">Don't have an account?{' '}<Link to="/register" className="text-blue-600 hover:underline">Create account</Link></Text>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
