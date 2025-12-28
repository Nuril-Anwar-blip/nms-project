/** AUTO-DOC: src/components/common/AuthCard.tsx
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: components/common/AuthCard.tsx
 *
 * Komponen `AuthCard` adalah wrapper ulang-pakai untuk halaman autentikasi.
 * Memberikan tata letak kartu terpusat dengan header (title + subtitle)
 * yang konsisten untuk halaman seperti login, register, dan forgot-password.
 *
 * Props:
 * - title: string - judul kartu (mis. "Sign In")
 * - subtitle?: string - teks kecil di bawah judul (opsional)
 * - children: React.ReactNode - konten kartu (form, alert, tombol, dsb.)
 *
 * Contoh penggunaan:
 * <AuthCard title="Sign in" subtitle="Selamat datang kembali">...form...</AuthCard>
 */

import React from 'react'
import { Card, Typography } from 'antd'

const { Title, Text } = Typography

interface AuthCardProps {
    title: string
    subtitle?: string
    children: React.ReactNode
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <Card className="w-full max-w-md shadow-lg p-6">
            <div className="text-center mb-6">
                <Title level={3} className="mb-1 text-gray-900">
                    {title}
                </Title>
                {subtitle && <Text className="text-gray-600">{subtitle}</Text>}
            </div>

            <div>{children}</div>
        </Card>
    )
}
