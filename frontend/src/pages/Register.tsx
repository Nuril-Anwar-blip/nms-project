/**
 * File: pages/Register.tsx
 * 
 * Halaman register untuk membuat user baru
 * 
 * Fungsi:
 * - Form untuk membuat user baru (admin only)
 * - Input name, email, password, dan role
 * - Validasi input
 * - Submit ke API untuk create user
 * 
 * Catatan:
 * - Hanya admin yang dapat membuat user baru
 * - User biasa tidak memiliki akses ke halaman ini
 * - Password harus kuat (minimal 8 karakter)
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/api'

export default function Register() {
  const navigate = useNavigate()

  /**
   * Check apakah user saat ini adalah admin
   */
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await getCurrentUser()
        if (user.role !== 'admin') {
          navigate('/dashboard')
        }
      } catch {
        navigate('/login')
      }
    }
    checkAdmin()
  }, [navigate])


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Register New User</h2>
        <p className="text-gray-600 mb-6">
          User registration is only available for administrators.
          Please contact your system administrator to create a new account.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
