/**
 * File: components/cards/StatsCard.tsx
 * 
 * Komponen Card untuk menampilkan statistik di dashboard NMS
 * 
 * Props:
 * - title: string - judul card
 * - value: number - nilai statistik
 * - icon: ReactNode - icon untuk card
 * - color: string - warna tema
 * - subtitle?: string - subtitle opsional
 */

import { Card, Typography } from 'antd'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const { Title, Text } = Typography

interface StatsCardProps {
    title: string
    value: number
    icon: ReactNode
    color: string
    subtitle?: string
}

export default function StatsCard({ title, value, icon, color, subtitle }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className="shadow-sm border border-gray-200"
                style={{
                    background: 'white',
                    borderRadius: '12px'
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: color }}
                        >
                            {icon}
                        </div>
                        <div>
                            <Text className="text-gray-500 text-sm">{title}</Text>
                            <Title level={3} className="!mb-0 !text-2xl font-bold">
                                {value.toLocaleString()}
                            </Title>
                            {subtitle && (
                                <Text className="text-gray-400 text-xs">{subtitle}</Text>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
