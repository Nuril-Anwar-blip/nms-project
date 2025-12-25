/**
 * File: vite.config.ts
 * 
 * Konfigurasi Vite untuk build tool
 * Mengatur plugin React dan konfigurasi build untuk production
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})

