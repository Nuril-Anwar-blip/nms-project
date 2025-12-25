/**
 * File: pages/Login.tsx
 * 
 * Halaman Login untuk autentikasi user
 * 
 * Fungsi:
 * - Menampilkan form login (email dan password)
 * - Mengirim request ke API /api/auth/login
 * - Menyimpan token JWT dan user data ke localStorage
 * - Redirect ke dashboard setelah login berhasil
 * 
 * Alur:
 * 1. User input email dan password
 * 2. Submit form -> POST /api/auth/login
 * 3. Jika berhasil, simpan token dan redirect ke /dashboard
 * 4. Jika gagal, tampilkan error message
 */

import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import type { LoginRequest } from '../types'

export default function Login() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  /**
   * Handle submit form login
   * Mengirim request ke API dan menangani response
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(formData)

      // Simpan token dan user data ke localStorage
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Redirect ke dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal. Periksa email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle perubahan input form
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="bg-[color:var(--nms-surface)] rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left illustration / brand */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <div className="space-y-4 text-center px-6">
              <div className="text-5xl">📡</div>
              <h1 className="text-2xl font-semibold text-gray-900">NMS ZTE OLT</h1>
              <p className="text-sm text-gray-600">Network Management System — Internal Operations</p>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign in to your account</h2>
              <p className="text-sm text-gray-500">For internal operations only</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="admin@nms.local"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

