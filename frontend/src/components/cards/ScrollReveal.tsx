import React, {
    useEffect,
    useRef,
    useMemo,
    ReactNode,
    RefObject
} from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface ScrollRevealProps {
    children: ReactNode
    scrollContainerRef?: RefObject<HTMLElement>
    enableBlur?: boolean
    baseOpacity?: number
    baseRotation?: number
    blurStrength?: number
    containerClassName?: string
    textClassName?: string
    rotationEnd?: string
    wordAnimationEnd?: string
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    baseOpacity = 0.15,
    baseRotation = 2,
    blurStrength = 4,
    containerClassName = '',
    textClassName = '',
    rotationEnd = 'bottom bottom',
    wordAnimationEnd = 'bottom bottom'
}) => {
    const containerRef = useRef<HTMLHeadingElement>(null)

    /**
     * Split hanya jika children adalah string
     * Aman untuk enterprise landing page
     */
    const splitText = useMemo(() => {
        if (typeof children !== 'string') return children

        return children.split(/(\s+)/).map((word, index) => {
            if (/^\s+$/.test(word)) return word

            return (
                <span
                    key={index}
                    className="inline-block word will-change-[opacity,filter]"
                >
                    {word}
                </span>
            )
        })
    }, [children])

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            const el = containerRef.current!
            const scroller =
                scrollContainerRef?.current ?? window

            // ROTATION (halus, enterprise feel)
            gsap.fromTo(
                el,
                { rotate: baseRotation, transformOrigin: '0% 50%' },
                {
                    rotate: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom',
                        end: rotationEnd,
                        scrub: true
                    }
                }
            )

            const words = el.querySelectorAll<HTMLElement>('.word')

            // OPACITY
            gsap.fromTo(
                words,
                { opacity: baseOpacity },
                {
                    opacity: 1,
                    stagger: 0.04,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=20%',
                        end: wordAnimationEnd,
                        scrub: true
                    }
                }
            )

            // BLUR (opsional)
            if (enableBlur) {
                gsap.fromTo(
                    words,
                    { filter: `blur(${blurStrength}px)` },
                    {
                        filter: 'blur(0px)',
                        stagger: 0.04,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: el,
                            scroller,
                            start: 'top bottom-=20%',
                            end: wordAnimationEnd,
                            scrub: true
                        }
                    }
                )
            }
        }, containerRef)

        return () => ctx.revert()
    }, [
        scrollContainerRef,
        enableBlur,
        baseRotation,
        baseOpacity,
        blurStrength,
        rotationEnd,
        wordAnimationEnd
    ])

    return (
        <h2
            ref={containerRef}
            className={`my-6 ${containerClassName}`}
        >
            <p
                className={`text-[clamp(1.6rem,3.8vw,3rem)] leading-relaxed font-semibold text-slate-800 ${textClassName}`}
            >
                {splitText}
            </p>
        </h2>
    )
}

export default ScrollReveal
