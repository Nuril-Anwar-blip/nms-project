import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ScrollVelocityProps {
    text: string
    speed?: number
    className?: string
}

export default function ScrollVelocity({
    text,
    speed = 100,
    className = ''
}: ScrollVelocityProps) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()

    const x = useTransform(scrollY, v => -(v / speed) % 1000)

    return (
        <div ref={ref} className="overflow-hidden whitespace-nowrap">
            <motion.div
                style={{ x }}
                className={`inline-block ${className}`}
            >
                {text.repeat(10)}
            </motion.div>
        </div>
    )
}
