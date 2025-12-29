/** AUTO-DOC: src/App.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: App.tsx
 * 
 * Root component aplikasi NMS ZTE OLT
 * Mengatur routing dan struktur navigasi aplikasi
 * 
 * Struktur Routing:
 * - Public routes: Landing page, Login, Register
 * - Protected routes: Semua halaman dashboard memerlukan authentication
 * 
 * ProtectedRoute component memeriksa token JWT di localStorage,
 * jika tidak ada token, user akan di-redirect ke halaman login
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import RegisterPage from './pages/auth/RegisterPage'
import Dashboard from './pages/Dashboard'
import DashboardLayout from './components/layout/DashboardLayout'
import OltManagement from './pages/OltManagement'
import OnuManagementPage from './pages/onu-management/OnuManagementPage'
import Provisioning from './pages/Provisioning'
import Alarms from './pages/Alarms'
import Maps from './pages/Maps'
import Monitoring from './pages/Monitoring'
import ActivityLogs from './pages/ActivityLogs'
import ClientApi from './pages/ClientApi'

/**
 * ProtectedRoute Component
 * 
 * Component untuk melindungi route yang memerlukan authentication
 * Memeriksa token JWT di localStorage
 * Jika tidak ada token, redirect ke halaman login
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

/**
 * Main App Component
 * 
 * Mengatur semua route aplikasi dan struktur navigasi
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Tidak memerlukan authentication */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Dashboard Routes - Memerlukan authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/monitoring"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Monitoring />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/olts"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OltManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/onus"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OnuManagementPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/provisioning"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Provisioning />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/alarms"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Alarms />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/activity-logs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ActivityLogs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/maps"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Maps />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/client-api"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientApi />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - Redirect ke landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

