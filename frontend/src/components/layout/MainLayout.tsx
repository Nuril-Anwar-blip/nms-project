/** AUTO-DOC: src/components/layout/MainLayout.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/layout/MainLayout.tsx
 * 
 * Komponen layout utama untuk dashboard NMS ZTE OLT
 * 
 * Fungsi:
 * - Layout wrapper untuk seluruh aplikasi
 * - Menggabungkan Sidebar dan Header
 * - Responsive design
 * - State management untuk sidebar toggle
 * 
 * Props:
 * - children: React.ReactNode - konten halaman
 * - activeTab: string - menu item yang sedang aktif
 * - user: User | null - data user yang sedang login
 * - onLogout: function - handler untuk logout
 * - onNavigate: function - handler untuk navigasi
 */

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import type { User } from '../../types'

interface MainLayoutProps {
    children: React.ReactNode
    activeTab: string
    user: User | null
    onLogout: () => void
    onNavigate: (path: string) => void
}

export default function MainLayout({
    children,
    activeTab,
    user,
    onLogout,
    onNavigate
}: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                open={sidebarOpen}
                activeTab={activeTab}
                user={user}
                onToggle={handleToggleSidebar}
                onNavigate={onNavigate}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header
                    activeTab={activeTab}
                    user={user}
                    onLogout={onLogout}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
