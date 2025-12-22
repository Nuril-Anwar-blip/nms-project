/**
 * Register Component
 * 
 * Halaman pendaftaran untuk membuat akun baru
 * 
 * PROPS: Tidak ada props
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah warna: Edit className gradient dan color (bg-blue-600, text-blue-600, dll)
 * - Ubah field: Tambah/kurangi input field dengan duplikat div "mb-4"
 * - Ubah validasi: Edit fungsi handleSubmit untuk validasi custom
 * - Ubah layout: Edit struktur form dan grid
 * - Ubah teks: Edit semua label dan placeholder
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        phone: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Validasi password match
        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok')
            return
        }

        // Validasi password length
        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter')
            return
        }

        setLoading(true)

        try {
            // TODO: Implementasi API register
            // const response = await fetch('/api/auth/register', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData)
            // })

            // Simulasi register untuk demo
            setTimeout(() => {
                // Simpan user data
                localStorage.setItem('user', JSON.stringify({
                    name: formData.name,
                    email: formData.email
                }))

                // Redirect ke login atau dashboard
                navigate('/login')
                setLoading(false)
            }, 1000)
        } catch (err) {
            setError('Registrasi gagal. Silakan coba lagi.')
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    {/* Logo/Title */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl text-white">🚀</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Buat Akun Baru
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Register Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Konfirmasi Password *
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="Ulangi password"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Company Field */}
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Perusahaan
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="PT. Contoh"
                                />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Telepon
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                    placeholder="081234567890"
                                />
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                Saya menyetujui{' '}
                                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                                    Syarat & Ketentuan
                                </Link>
                                {' '}dan{' '}
                                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                                    Kebijakan Privasi
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Membuat akun...
                                    </span>
                                ) : (
                                    'Daftar Sekarang'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                        ← Kembali ke halaman utama
                    </Link>
                </div>
            </div>
        </div>
    )
}

