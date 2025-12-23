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
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

