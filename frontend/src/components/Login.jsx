/**
 * Login Component
 * 
 * Halaman login untuk mengakses dashboard NMS
 * 
 * PROPS: Tidak ada props
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah warna background: Edit className di div utama (bg-gradient-to-br...)
 * - Ubah warna form: Edit className di card (bg-white, shadow-lg, dll)
 * - Ubah warna button: Edit className button (bg-blue-600, hover:bg-blue-700)
 * - Ubah logo: Ganti src di tag <img> atau hapus jika tidak ada logo
 * - Ubah teks: Edit semua teks di dalam JSX
 * - Ubah layout: Edit struktur flex/grid
 * - Tambah field: Duplikat div dengan className "mb-4" untuk input field baru
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // TODO: Implementasi API login
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData)
            // })

            // Simulasi login untuk demo
            setTimeout(() => {
                // Simpan token atau user data
                localStorage.setItem('token', 'demo-token')
                localStorage.setItem('user', JSON.stringify({ email: formData.email }))

                // Redirect ke dashboard
                navigate('/dashboard')
                setLoading(false)
            }, 1000)
        } catch (err) {
            setError('Login gagal. Periksa email dan password Anda.')
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Logo/Title - Ubah atau hapus jika tidak ada logo */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl text-white">📡</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Masuk ke NMS
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Atau{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                daftar akun baru
                            </Link>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Email Field - Duplikat untuk field baru */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="nama@email.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                    Lupa password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button - Ubah warna dan style di sini */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </span>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Atau masuk dengan</span>
                            </div>
                        </div>

                        {/* Social Login Buttons - Hapus jika tidak digunakan */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                <span>GitHub</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center">
                    <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                        ← Kembali ke halaman utama
                    </Link>
                </div>
            </div>
        </div>
    )
}

