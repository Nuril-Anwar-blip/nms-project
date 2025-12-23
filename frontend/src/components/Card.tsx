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
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
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

