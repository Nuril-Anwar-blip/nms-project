/** AUTO-DOC: src/main.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: main.tsx
 * 
 * Entry point aplikasi React TypeScript
 * File ini melakukan inisialisasi React dan mounting aplikasi ke DOM
 * Menggunakan StrictMode untuk membantu mendeteksi masalah dalam development
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider, theme } from 'antd'
import idID from 'antd/es/locale/id_ID'
// import App from './App'

import App from './App.Coba'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ConfigProvider
      locale={idID}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563eb',
          colorInfo: '#2563eb',
          colorSuccess: '#16a34a',
          colorWarning: '#f59e0b',
          colorError: '#dc2626',
          borderRadius: 8,
          fontSize: 14
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)

