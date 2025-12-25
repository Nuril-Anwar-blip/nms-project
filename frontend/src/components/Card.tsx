/**
 * File: components/Card.tsx
 * 
 * Komponen card reusable untuk menampilkan konten dalam container card
 * 
 * Props:
 * - title: Judul card (opsional)
 * - children: Konten card
 * - className: Custom CSS classes
 * - headerAction: Action button di header (opsional)
 * 
 * Usage:
 * <Card title="OLT Status">
 *   <p>Content here</p>
 * </Card>
 */

import React from 'react'

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export default function Card({ title, children, className = '', headerAction }: CardProps) {
  /**
   * Card component disesuaikan untuk tampilan enterprise:
   * - Background menggunakan variable `--nms-surface`
   * - Radius sedikit lebih besar untuk kesan modern
   * - Shadow halus agar tidak mengganggu visual dalam penggunaan lama
   * - Header terpisah dengan ukuran teks yang jelas
   */
  return (
    <div className={`bg-[color:var(--nms-surface)] rounded-2xl shadow-sm p-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

// coba aja sih