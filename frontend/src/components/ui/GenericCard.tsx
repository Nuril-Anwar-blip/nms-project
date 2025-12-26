/**
 * File: components/ui/GenericCard.tsx
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
 * <GenericCard title="OLT Status">
 *   <p>Content here</p>
 * </GenericCard>
 */

import React from 'react'
import { Card as AntCard, Typography } from 'antd'
import { motion } from 'framer-motion'

const { Title } = Typography

interface GenericCardProps {
    title?: string
    children: React.ReactNode
    className?: string
    headerAction?: React.ReactNode
    size?: 'small' | 'default'
    bordered?: boolean
    hoverable?: boolean
}

export default function GenericCard({
    title,
    children,
    className = '',
    headerAction,
    size = 'default',
    bordered = true,
    hoverable = false
}: GenericCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            <AntCard
                size={size}
                bordered={bordered}
                hoverable={hoverable}
                className="shadow-sm"
                title={title && (
                    <div className="flex items-center justify-between">
                        <Title level={4} className="!mb-0">
                            {title}
                        </Title>
                        {headerAction}
                    </div>
                )}
            >
                {children}
            </AntCard>
        </motion.div>
    )
}
