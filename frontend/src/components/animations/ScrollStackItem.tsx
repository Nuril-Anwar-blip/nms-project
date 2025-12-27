import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ScrollStackItemProps {
    children: ReactNode
    index: number
}

export default function ScrollStackItem({
    children,
    index
}: ScrollStackItemProps) {
    return (
        <motion.div
            style={{
                top: index * 24
            }}
            className="
        sticky
        bg-white
        rounded-2xl
        shadow-lg
        p-8
        mb-16
        border
        border-gray-200
      "
        >
            {children}
        </motion.div>
    )
}
