/** AUTO-DOC: src/pages/ClientApi.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: pages/ClientApi.tsx
 * 
 * Halaman dokumentasi Client API untuk integrasi eksternal
 * 
 * Fungsi:
 * - Menampilkan dokumentasi endpoint API
 * - Contoh request dan response
 * - Informasi autentikasi dan authorization
 * - Testing tools untuk API (opsional)
 * 
 * Alur kerja:
 * 1. Menampilkan daftar endpoint API yang tersedia
 * 2. Menampilkan contoh request untuk setiap endpoint
 * 3. Menampilkan contoh response
 * 4. Menjelaskan parameter dan autentikasi yang diperlukan
 */

import Card from '../components/cards/Card'

export default function ClientApi() {
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

  return (
    <div className="space-y-6">
      <Card title="Client API Documentation">
        <div className="space-y-6">
          {/* Authentication */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
            <p className="text-sm text-gray-600 mb-2">
              Semua endpoint memerlukan JWT token di header Authorization:
            </p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`Authorization: Bearer <your-token>`}
            </pre>
          </section>

          {/* Endpoints */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Endpoints</h3>

            <div className="space-y-4">
              {/* Auth Endpoints */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Authentication</h4>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/auth/login</code> - Login</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/auth/logout</code> - Logout</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/auth/me</code> - Get current user</li>
                </ul>
              </div>

              {/* Dashboard Endpoints */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Dashboard</h4>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/dashboard/stats</code> - Dashboard statistics</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/dashboard/olt-performance</code> - OLT performance</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/dashboard/recent-alarms</code> - Recent alarms</li>
                </ul>
              </div>

              {/* OLT Endpoints */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">OLT Management</h4>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/olts</code> - List all OLTs</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/olts</code> - Create OLT</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/olts/{'{id}'}</code> - Get OLT by ID</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">PUT {apiBase}/api/olts/{'{id}'}</code> - Update OLT</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">DELETE {apiBase}/api/olts/{'{id}'}</code> - Delete OLT</li>
                </ul>
              </div>

              {/* ONU Endpoints */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-gray-900">ONU Management</h4>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/onus</code> - List ONUs</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/onus?olt_id={'{id}'}</code> - Filter by OLT</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">GET {apiBase}/api/onus/{'{id}'}</code> - Get ONU by ID</li>
                </ul>
              </div>

              {/* Provisioning Endpoints */}
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900">Provisioning</h4>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/provisioning/onu</code> - Provision ONU</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/provisioning/onu/{'{id}'}/reboot</code> - Reboot ONU</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/provisioning/onu/{'{id}'}/reset</code> - Reset ONU</li>
                </ul>
              </div>

              {/* Monitoring Endpoints */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <h4 className="font-medium text-gray-900">Monitoring</h4>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/monitoring/olt/{'{id}'}/poll</code> - Poll OLT</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">POST {apiBase}/api/monitoring/olt/{'{id}'}/sync-onus</code> - Sync ONUs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Example Request */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm font-medium text-gray-700 mb-2">Login:</p>
              <pre className="text-xs overflow-x-auto">
                {`POST ${apiBase}/api/auth/login
Content-Type: application/json

{
  "email": "admin@nms.local",
  "password": "your-password"
}`}
              </pre>
            </div>
          </section>

          {/* Response Format */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Format</h3>
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-sm font-medium text-gray-700 mb-2">Success Response:</p>
              <pre className="text-xs overflow-x-auto">
                {`{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@nms.local",
    "role": "admin"
  }
}`}
              </pre>
            </div>
          </section>
        </div>
      </Card>
    </div>
  )
}
