/**
 * File: pages/auth/LoginPage.tsx
 * Deskripsi: Halaman Login dengan animasi yang menarik
 * 
 * Fitur:
 * - Animasi background menggunakan DotGrid
 * - Animasi teks menggunakan SplitText dan BlurText
 * - Theme toggle (dark/light mode)
 * - Glassmorphism effect
 * - Responsive design
 * - Validasi form dengan Ant Design
 * - Error handling yang baik
 * 
 * Komponen Animasi yang Digunakan:
 * - DotGrid: Background interaktif dengan dots
 * - SplitText: Animasi teks per kata untuk headline
 * - BlurText: Teks dengan efek blur saat muncul
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Checkbox, Alert, Typography } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks'
import CustomButton from '../../components/common/CustomButton'
import { colors } from '../../lib/colors'
import DotGrid from '../../components/animations/DotGrid'
import SplitText from '../../components/animations/SplitText'
import BlurText from '../../components/animations/BlurText'

const { Text } = Typography

/**
 * Komponen: LoginPage
 * 
 * Deskripsi:
 * - Menampilkan halaman login dengan animasi yang menarik
 * - Layout dua kolom: hero kiri dengan animasi, form kanan
 * - Menyediakan toggle theme (light / dark) yang disimpan di localStorage
 * - Menggunakan Ant Design Form untuk validasi
 * - Memanggil `useAuth().login` untuk autentikasi dan redirect ke `/dashboard`
 */
export default function LoginPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { login, error: authError } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    /**
     * State: theme
     * Menyimpan preferensi tema pengguna: 'light' atau 'dark'
     * Default dibaca dari localStorage jika tersedia
     */
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme')
        return savedTheme === 'dark' ? 'dark' : 'light'
    })

    /**
     * Effect: persist theme dan apply ke document
     * Menyimpan preferensi theme ke localStorage dan apply ke document
     */
    useEffect(() => {
        try {
            localStorage.setItem('theme', theme)
            if (theme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        } catch (e) {
            // Jika penyimpanan gagal (contoh: Private mode), tetap lanjutkan tanpa crash
        }
    }, [theme])

    /**
     * Effect: Check for success message from registration
     */
    useEffect(() => {
        const state = location.state as { message?: string } | null
        if (state?.message) {
            // Show success message (you can use a notification here)
            setError(null)
            // You might want to show this as a success alert instead
        }
    }, [location])

    /**
     * Handler: handleSubmit
     * Dipanggil saat form login disubmit
     * Memanggil `login(email, password)` dari `useAuth()`
     * Jika berhasil: redirect ke `/dashboard`, jika gagal: set error message
     */
    const handleSubmit = async (values: any) => {
        setLoading(true)
        setError(null)
        try {
            // Use email field (API expects email)
            const success = await login(values.email, values.password)
            if (success) navigate('/dashboard')
            else setError(authError || 'Login gagal. Periksa email dan password.')
        } catch (err: any) {
            setError(err?.message || 'Login gagal. Periksa koneksi atau server.')
        } finally {
            setLoading(false)
        }
    }

    const isDark = theme === 'dark'
    const heroGradient = `linear-gradient(135deg, ${colors.heroStart} 0%, ${colors.heroEnd} 100%)`

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" 
            style={{ 
                background: isDark ? colors.background.dark : colors.background.light 
            }}
        >
            {/* DotGrid Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    opacity: 0.3,
                    pointerEvents: 'none'
                }}
            >
                <DotGrid
                    dotSize={4}
                    gap={20}
                    baseColor={isDark ? colors.text.secondary : '#9CA3AF'}
                    activeColor={colors.primary}
                    proximity={100}
                    shockRadius={150}
                    shockStrength={4}
                    resistance={900}
                    returnDuration={1.2}
                />
            </div>

            {/* Theme toggle top-right */}
            <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                style={{ 
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                }}
            >
                {isDark ? (
                    <SunOutlined style={{ color: '#FCD34D', fontSize: '20px' }} />
                ) : (
                    <MoonOutlined style={{ color: colors.primary, fontSize: '20px' }} />
                )}
            </button>

            <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 relative z-10" style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: isDark ? 'rgba(7, 16, 38, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>
                {/* Left - Hero dengan animasi */}
                <div 
                    className="hidden md:flex items-center justify-center p-12 relative overflow-hidden" 
                    style={{ background: heroGradient }}
                >
                    {/* Gradient overlay untuk efek depth */}
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to bottom right, rgba(82, 39, 255, 0.2), transparent)'
                        }}
                    />
                    
                    <div className="text-center text-white max-w-sm relative z-10">
                        {/* Logo dengan animasi */}
                        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm transition-transform duration-300 hover:scale-110" style={{ 
                            boxShadow: 'inset 0 0 40px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)' 
                        }}>
                            <div className="text-4xl">⚙️</div>
                        </div>

                        {/* Heading dengan SplitText animasi */}
                        <h2 
                            className="text-4xl font-extrabold mb-3"
                            style={{ color: colors.text.primary }}
                        >
                            <SplitText
                                text="NMS Zetset"
                                splitType="chars"
                                delay={0.5}
                                duration={0.8}
                                ease="power3.out"
                                from={{ opacity: 0, y: 30 }}
                                to={{ opacity: 1, y: 0 }}
                            />
                        </h2>

                        {/* Subtitle dengan BlurText animasi */}
                        <div className="mb-8">
                            <BlurText
                                text="Manage your network infrastructure with ease and efficiency"
                                animateBy="words"
                                direction="top"
                                delay={80}
                                className="text-white/90"
                            />
                        </div>

                        {/* Features list dengan animasi */}
                        <div className="mt-8 text-sm text-white/80 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Real-time monitoring</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Easy provisioning</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Scalable device management</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Form card dengan glassmorphism */}
                <div 
                    className="flex items-center justify-center p-8 md:p-12" 
                    style={{ 
                        background: isDark ? 'rgba(11, 18, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)'
                    }}
                >
                    <div className="w-full max-w-md">
                        {error && (
                            <Alert 
                                message={error} 
                                type="error" 
                                className="mb-6 rounded-lg" 
                                closable 
                                onClose={() => setError(null)} 
                            />
                        )}
                        {(location.state as { message?: string } | null)?.message && (
                            <Alert 
                                message={(location.state as { message: string }).message} 
                                type="success" 
                                className="mb-6 rounded-lg" 
                                closable 
                                onClose={() => navigate(location.pathname, { replace: true, state: {} })} 
                            />
                        )}

                        {/* Header dengan animasi */}
                        <div className="mb-8 text-center">
                            <h1 
                                className="text-3xl md:text-4xl font-extrabold mb-2"
                                style={{ 
                                    color: isDark ? colors.text.primary : colors.text.dark 
                                }}
                            >
                                <SplitText
                                    text="Welcome Back"
                                    splitType="words"
                                    delay={0.3}
                                    duration={0.6}
                                    ease="power3.out"
                                    from={{ opacity: 0, y: 20 }}
                                    to={{ opacity: 1, y: 0 }}
                                />
                            </h1>
                            <div 
                                className="text-sm mt-2"
                                style={{
                                    color: isDark ? colors.text.secondary : colors.text.muted
                                }}
                            >
                                <BlurText
                                    text="Sign in to your account to continue"
                                    animateBy="words"
                                    direction="top"
                                    delay={50}
                                />
                            </div>
                        </div>

                        {/* Form */}
                        <Form 
                            form={form} 
                            name="login" 
                            onFinish={handleSubmit} 
                            layout="vertical" 
                            size="large" 
                            initialValues={{ remember: true }}
                        >
                            <Form.Item 
                                name="email" 
                                rules={[
                                    { required: true, message: 'Masukkan email!' },
                                    { type: 'email', message: 'Masukkan email yang valid!' }
                                ]}
                            >
                                <Input 
                                    prefix={<UserOutlined style={{ color: colors.primary }} />} 
                                    placeholder="Enter your email" 
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
                                />
                            </Form.Item>

                            <Form.Item 
                                name="password" 
                                rules={[{ required: true, message: 'Masukkan password!' }]}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: colors.primary }} />} 
                                    placeholder="Enter your password" 
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <div className="flex items-center justify-between">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox
                                            style={{
                                                color: isDark ? colors.text.secondary : colors.text.dark
                                            }}
                                        >
                                            Remember me
                                        </Checkbox>
                                    </Form.Item>
                                    <Link 
                                        to="/forgot-password" 
                                        style={{ color: colors.primary }}
                                        className="hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <CustomButton 
                                    htmlType="submit" 
                                    type="primary" 
                                    loading={loading} 
                                    disabled={loading} 
                                    className="w-full flex items-center justify-center rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg" 
                                    style={{ 
                                        background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`,
                                        border: 'none',
                                        height: '48px'
                                    }}
                                >
                                    <LoginOutlined className="mr-2" /> Sign In
                                </CustomButton>
                            </Form.Item>

                            <div className="text-center mt-4">
                                <Text 
                                    style={{
                                        color: isDark ? colors.text.secondary : colors.text.muted
                                    }}
                                >
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/register" 
                                        style={{ color: colors.primary }}
                                        className="font-semibold hover:underline"
                                    >
                                        Create account
                                    </Link>
                                </Text>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
