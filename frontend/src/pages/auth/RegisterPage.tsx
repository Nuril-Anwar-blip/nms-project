/**
 * File: pages/auth/RegisterPage.tsx
 * Deskripsi: Halaman Register dengan animasi yang menarik dan fitur lengkap
 * 
 * Fitur:
 * - Animasi background menggunakan DotGrid
 * - Animasi teks menggunakan SplitText dan BlurText
 * - Theme toggle (dark/light mode)
 * - Glassmorphism effect
 * - Responsive design
 * - Validasi form dengan Ant Design
 * - Error handling yang baik
 * - Password confirmation
 * - Terms and conditions checkbox
 * - Verifikasi OTP untuk email/telepon
 * - Field instansi
 * - Dropdown provinsi, kota, dan kecamatan
 * 
 * Komponen Animasi yang Digunakan:
 * - DotGrid: Background interaktif dengan dots
 * - SplitText: Animasi teks per kata untuk headline
 * - BlurText: Teks dengan efek blur saat muncul
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, Alert, Typography, Select, Button, Space } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, MoonOutlined, SunOutlined, PhoneOutlined, SendOutlined, SafetyOutlined, BankOutlined } from '@ant-design/icons'
import CustomButton from '../../components/common/CustomButton'
import { registerUser } from '../../services/api'
import { useAuth } from '../../hooks'
import { colors } from '../../lib/colors'
import DotGrid from '../../components/animations/DotGrid'
import SplitText from '../../components/animations/SplitText'
import BlurText from '../../components/animations/BlurText'
import { simulateSendOTP, verifyOTP } from '../../utils/otp'
import { getProvinces, getCitiesByProvince, getDistrictsByCity, type City } from '../../data/indonesia-regions'

const { Text } = Typography
const { Option } = Select

/**
 * Komponen: RegisterPage
 * 
 * Deskripsi:
 * - Halaman pendaftaran user baru untuk NMS dengan animasi menarik
 * - Menyediakan form pembuatan akun dengan validasi lengkap
 * - Setelah berhasil mendaftar, pengguna akan diarahkan ke halaman login
 * - Layout dua kolom: hero kiri dengan animasi, form kanan
 * - Theme toggle untuk dark/light mode
 */
export default function RegisterPage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { user } = useAuth()

    // State untuk OTP
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpCode, setOtpCode] = useState('')
    const [countdown, setCountdown] = useState(0)

    // State untuk dropdown wilayah
    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [selectedCity, setSelectedCity] = useState<string>('')
    const [cities, setCities] = useState<City[]>([])
    const [districts, setDistricts] = useState<string[]>([])

    // State untuk verification type (email atau phone)
    const [verificationType, setVerificationType] = useState<'email' | 'phone'>('email')

    const provinces = getProvinces()

    /**
     * State: theme
     * Menyimpan preferensi tema pengguna: 'light' atau 'dark'
     */
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme')
        return savedTheme === 'dark' ? 'dark' : 'light'
    })

    /**
     * Effect: persist theme dan apply ke document
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
            // Jika penyimpanan gagal, tetap lanjutkan
        }
    }, [theme])

    /**
     * Effect: Countdown timer untuk resend OTP
     */
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    /**
     * Handler: handleProvinceChange
     * Update kota saat provinsi berubah
     */
    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvince(provinceId)
        setSelectedCity('')
        setDistricts([])
        const cityList = getCitiesByProvince(provinceId)
        setCities(cityList)
        form.setFieldsValue({ city: undefined, district: undefined })
    }

    /**
     * Handler: handleCityChange
     * Update kecamatan saat kota berubah
     */
    const handleCityChange = (cityId: string) => {
        setSelectedCity(cityId)
        setDistricts([])
        if (selectedProvince && cityId) {
            const districtList = getDistrictsByCity(selectedProvince, cityId)
            setDistricts(districtList)
        }
        form.setFieldsValue({ district: undefined })
    }

    /**
     * Handler: handleSendOTP
     * Mengirim kode OTP ke email atau telepon
     * Catatan: Saat ini menggunakan simulasi di frontend (utils/otp.ts)
     * Untuk production, sebaiknya menggunakan API backend untuk generate dan kirim OTP
     */
    const handleSendOTP = async () => {
        const email = form.getFieldValue('email')
        const phone = form.getFieldValue('phone')

        if (!email && !phone) {
            setError('Masukkan email atau nomor telepon terlebih dahulu')
            return
        }

        setOtpLoading(true)
        setError(null)

        try {
            // Simulasi send OTP (dalam production, ini akan memanggil API backend)
            // Prioritas: email lebih dulu, jika tidak ada baru phone
            const target = email || phone
            const code = simulateSendOTP(email, phone)
            setOtpSent(true)
            setOtpVerified(false)
            setOtpCode('')
            setCountdown(60) // 60 detik countdown
            setVerificationType(email ? 'email' : 'phone')
        } catch (err) {
            setError('Gagal mengirim kode verifikasi. Silakan coba lagi.')
        } finally {
            setOtpLoading(false)
        }
    }

    /**
     * Handler: handleVerifyOTP
     * Memverifikasi kode OTP
     */
    const handleVerifyOTP = () => {
        const email = form.getFieldValue('email')
        const phone = form.getFieldValue('phone')

        if (!otpCode || otpCode.length !== 6) {
            setError('Masukkan kode OTP 6 digit')
            return
        }

        const isValid = verifyOTP(otpCode, email, phone)
        if (isValid) {
            setOtpVerified(true)
            setError(null)
        } else {
            setError('Kode OTP tidak valid atau telah kedaluwarsa')
            setOtpCode('')
        }
    }

    /**
     * Handler: handleSubmit
     * Memproses pendaftaran user baru
     */
    const handleSubmit = async (values: any) => {
        // Validasi OTP
        if (!otpVerified) {
            setError('Verifikasi email/telepon diperlukan')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const payload: any = {
                name: values.name,
                email: values.email,
                password: values.password,
            }
            if (values.phone) payload.phone = values.phone
            if (values.instansi) payload.instansi = values.instansi
            if (values.province) payload.province = values.province
            if (values.city) payload.city = values.city
            if (values.district) payload.district = values.district
            if (values.role) payload.role = values.role

            await registerUser(payload)
            // Sukses -> redirect ke login dengan pesan sukses
            navigate('/login', { state: { message: 'Registrasi berhasil! Silakan login dengan email dan password Anda.' } })
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Pendaftaran gagal. Silakan coba lagi.'
            setError(msg)
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
                    {/* Gradient overlay */}
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
                            <div className="text-4xl">🚀</div>
                        </div>

                        {/* Heading dengan SplitText animasi */}
                        <h2
                            className="text-4xl font-extrabold mb-3"
                            style={{ color: colors.text.primary }}
                        >
                            <SplitText
                                text="Get Started"
                                splitType="words"
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
                                text="Create your account and start managing your network infrastructure"
                                animateBy="words"
                                direction="top"
                                delay={80}
                                className="text-white/90"
                            />
                        </div>

                        {/* Features list */}
                        <div className="mt-8 text-sm text-white/80 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Free account setup</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Full access to features</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>24/7 customer support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Form card */}
                <div
                    className="flex items-center justify-center p-8 md:p-12 overflow-y-auto max-h-screen"
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

                        {/* Header dengan animasi */}
                        <div className="mb-8 text-center">
                            <h1
                                className="text-3xl md:text-4xl font-extrabold mb-2"
                                style={{
                                    color: isDark ? colors.text.primary : colors.text.dark
                                }}
                            >
                                <SplitText
                                    text="Create Account"
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
                                    text="Daftar ke NMS Zetset untuk mulai"
                                    animateBy="words"
                                    direction="top"
                                    delay={50}
                                />
                            </div>
                        </div>

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
                                    prefix={<UserOutlined style={{ color: colors.primary }} />}
                                    placeholder="Nama Lengkap"
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
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
                                    prefix={<MailOutlined style={{ color: colors.primary }} />}
                                    placeholder="Email"
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                rules={[
                                    { required: true, message: 'Masukkan nomor telepon!' },
                                    { pattern: /^[0-9+\-\s()]+$/, message: 'Format nomor telepon tidak valid' },
                                    { min: 10, message: 'Nomor telepon minimal 10 digit' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined style={{ color: colors.primary }} />}
                                    placeholder="Nomor Telepon (contoh: 081234567890)"
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
                                />
                            </Form.Item>

                            {/* OTP Verification Section */}
                            {!otpVerified && (
                                <Form.Item label="Verifikasi Email/Telepon">
                                    <Space.Compact className="w-full">
                                        <Input
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            placeholder="Kode OTP (6 digit)"
                                            maxLength={6}
                                            className="rounded-l-lg rounded-r-none"
                                            style={{
                                                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                            }}
                                            disabled={!otpSent}
                                        />
                                        <Button
                                            type="primary"
                                            onClick={otpSent ? handleVerifyOTP : handleSendOTP}
                                            loading={otpLoading}
                                            disabled={countdown > 0}
                                            className="rounded-r-lg rounded-l-none"
                                            icon={otpSent ? <SafetyOutlined /> : <SendOutlined />}
                                        >
                                            {otpSent ? (countdown > 0 ? `${countdown}s` : 'Verifikasi') : 'Kirim OTP'}
                                        </Button>
                                    </Space.Compact>
                                    {otpSent && !otpVerified && (
                                        <Text type="secondary" className="text-xs">
                                            Kode OTP telah dikirim ke {verificationType === 'email' ? 'email' : 'telepon'} Anda.
                                            {countdown > 0 && ` Kirim ulang dalam ${countdown} detik.`}
                                        </Text>
                                    )}
                                    {otpVerified && (
                                        <Text type="success" className="text-xs flex items-center gap-1">
                                            <SafetyOutlined /> Email/Telepon telah terverifikasi
                                        </Text>
                                    )}
                                </Form.Item>
                            )}

                            {otpVerified && (
                                <Alert
                                    message="Verifikasi berhasil"
                                    description="Email/Telepon Anda telah terverifikasi"
                                    type="success"
                                    showIcon
                                    className="mb-4 rounded-lg"
                                />
                            )}

                            <Form.Item
                                name="instansi"
                                rules={[{ required: true, message: 'Masukkan nama instansi!' }]}
                            >
                                <Input
                                    prefix={<BankOutlined style={{ color: colors.primary }} />}
                                    placeholder="Nama Instansi/Perusahaan"
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
                                />
                            </Form.Item>

                            {/* Provinsi */}
                            <Form.Item
                                name="province"
                                rules={[{ required: true, message: 'Pilih provinsi!' }]}
                                label="Provinsi"
                            >
                                <Select
                                    placeholder="Pilih Provinsi"
                                    className="rounded-lg"
                                    onChange={handleProvinceChange}
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'
                                    }}
                                >
                                    {provinces.map(province => (
                                        <Option key={province.id} value={province.id}>
                                            {province.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Kota */}
                            <Form.Item
                                name="city"
                                rules={[{ required: true, message: 'Pilih kota!' }]}
                                label="Kota/Kabupaten"
                            >
                                <Select
                                    placeholder="Pilih Kota/Kabupaten"
                                    className="rounded-lg"
                                    disabled={!selectedProvince}
                                    onChange={handleCityChange}
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'
                                    }}
                                >
                                    {cities.map(city => (
                                        <Option key={city.id} value={city.id}>
                                            {city.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Kecamatan */}
                            <Form.Item
                                name="district"
                                rules={[{ required: true, message: 'Pilih kecamatan!' }]}
                                label="Kecamatan"
                            >
                                <Select
                                    placeholder="Pilih Kecamatan"
                                    className="rounded-lg"
                                    disabled={!selectedCity}
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'
                                    }}
                                >
                                    {districts.map(district => (
                                        <Option key={district} value={district}>
                                            {district}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Masukkan password!' },
                                    { min: 6, message: 'Password minimal 6 karakter!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: colors.primary }} />}
                                    placeholder="Password"
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
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
                                    prefix={<LockOutlined style={{ color: colors.primary }} />}
                                    placeholder="Konfirmasi Password"
                                    className="rounded-lg"
                                    style={{
                                        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
                                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5E7EB'
                                    }}
                                />
                            </Form.Item>

                            {/* Role selection: default to operator for new registrations */}
                            <Form.Item name="role" initialValue="operator" hidden>
                                <Input />
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
                                <Checkbox
                                    style={{
                                        color: isDark ? colors.text.secondary : colors.text.dark
                                    }}
                                >
                                    Saya setuju dengan <a href="#" style={{ color: colors.primary }}>Syarat dan Ketentuan</a>
                                </Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <CustomButton
                                    htmlType="submit"
                                    type="primary"
                                    loading={loading}
                                    disabled={loading || !otpVerified}
                                    className="w-full rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                                    style={{
                                        background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`,
                                        border: 'none',
                                        height: '48px',
                                        opacity: (!otpVerified ? 0.6 : 1)
                                    }}
                                >
                                    Daftar
                                </CustomButton>
                            </Form.Item>

                            <div className="text-center mt-4">
                                <Text
                                    style={{
                                        color: isDark ? colors.text.secondary : colors.text.muted
                                    }}
                                >
                                    Sudah punya akun?{' '}
                                    <Link
                                        to="/login"
                                        style={{ color: colors.primary }}
                                        className="font-semibold hover:underline"
                                    >
                                        Masuk
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
