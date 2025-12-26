/**
 * File: components/cards/AlarmCard.tsx
 * 
 * Komponen Card untuk menampilkan alarm di dashboard NMS
 */

import { Card, Typography, Tag } from 'antd'
import { motion } from 'framer-motion'
import type { Alarm } from '../../types'
import SeverityBadge from '../status/SeverityBadge'

const { Text, Title } = Typography

interface AlarmCardProps {
    alarm: Alarm
}

export default function AlarmCard({ alarm }: AlarmCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                className="mb-3 shadow-sm border border-gray-200"
                style={{ borderRadius: '8px' }}
            >
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <SeverityBadge value={alarm.severity} kind="severity" size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <Text className="font-semibold text-gray-900 text-sm">
                                {alarm.type}
                            </Text>
                            <Tag color={alarm.status === 'active' ? 'red' : 'green'}>
                                {alarm.status}
                            </Tag>
                        </div>
                        <Text className="text-gray-700 text-sm mb-2 block">
                            {alarm.message}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                            {new Date(alarm.occurred_at).toLocaleString()}
                        </Text>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
