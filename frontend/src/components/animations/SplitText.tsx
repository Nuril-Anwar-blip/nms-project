/**
 * File: components/animations/SplitText.tsx
 * 
 * Komponen animasi untuk split text dengan React Bits
 */

import { motion } from 'framer-motion'

interface SplitTextProps {
    children: string
    delay?: number
    className?: string
}

export default function SplitText({ children, delay = 0, className = '' }: SplitTextProps) {
    const words = children.split(' ')

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay
            }
        }
    }

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                damping: 12,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: 'spring' as const,
                damping: 12,
                stiffness: 100
            }
        }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}