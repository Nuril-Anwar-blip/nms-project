/** AUTO-DOC: src/pages/LandingPage.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/LandingPage.tsx
 * 
 * Halaman landing page untuk aplikasi NMS
 * Halaman pertama yang dilihat user sebelum login
 */

import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">NMS ZTE OLT</h1>
        <p className="text-gray-600 mb-8">Network Management System</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  )
}

