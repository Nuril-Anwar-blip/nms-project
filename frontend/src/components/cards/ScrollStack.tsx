import { ReactNode } from 'react'

interface ScrollStackProps {
    children: ReactNode
    className?: string
}

export default function ScrollStack({
    children,
    className = ''
}: ScrollStackProps) {
    return (
        <section
            className={`relative max-w-6xl mx-auto px-6 ${className}`}
        >
            <div className="relative">
                {children}
            </div>
        </section>
    )
}
