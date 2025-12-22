/**
 * Main App Component dengan Routing
 * 
 * MODIFIKASI ROUTING:
 * - Tambah route baru: Tambah <Route> di dalam <Routes>
 * - Ubah path: Edit atribut "path" di <Route>
 * - Ubah component: Edit atribut "element" di <Route>
 * - Tambah protected route: Wrap dengan <ProtectedRoute> component
 * 
 * MODIFIKASI LAYOUT:
 * - Ubah header: Edit komponen Header atau hapus jika tidak perlu
 * - Ubah footer: Tambah komponen Footer
 * - Ubah theme: Edit className di div utama
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Buy from './components/Buy'
import Dashboard from './components/Dashboard'
import DashboardLayout from './components/DashboardLayout'
import OltManagement from './components/OltManagement'
import OnuManagement from './components/OnuManagement'
import Provisioning from './components/Provisioning'
import Alarms from './components/Alarms'
import Maps from './components/Maps'
import ClientApi from './components/ClientApi'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

// Protected Route Component - Edit logic auth di sini
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buy" element={<Buy />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard apiBase={API_BASE} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/olts"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OltManagement apiBase={API_BASE} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/onus"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OnuManagement apiBase={API_BASE} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/provisioning"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Provisioning apiBase={API_BASE} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/alarms"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Alarms apiBase={API_BASE} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/maps"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Maps apiBase={API_BASE} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/client-api"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientApi apiBase={API_BASE} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
