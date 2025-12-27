/**
 * BlurText Component
 * ------------------
 * Komponen animasi teks berbasis React + Framer Motion.
 * Menampilkan teks dengan efek blur dan transisi per kata atau per huruf
 * ketika elemen masuk ke dalam viewport (on-scroll reveal).
 *
 * Cocok untuk:
 * - Landing page
 * - Headline sekat
 * - Highlight text
 * - Intro animation
 *
 * Menggunakan IntersectionObserver agar animasi berjalan sekali
 * dan tidak membebani performa.
 */

import { motion, Transition, Easing } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Props untuk komponen BlurText
 */
type BlurTextProps = {
    /** Teks yang akan dianimasikan */
    text?: string;
    /** Delay animasi tiap kata/huruf (dalam ms) */
    delay?: number;
    /** Kelas tambahan untuk styling eksternal */
    className?: string;
    /** Mode pemisahan animasi */
    animateBy?: 'words' | 'letters';
    /** Arah muncul animasi */
    direction?: 'top' | 'bottom';
    /** Threshold IntersectionObserver */
    threshold?: number;
    /** Margin viewport untuk memicu animasi */
    rootMargin?: string;
    /** Snapshot awal animasi (opsional untuk override behaviour default) */
    animationFrom?: Record<string, string | number>;
    /** Snapshot tahap-tahap animasi (opsional, multi-keyframe) */
    animationTo?: Array<Record<string, string | number>>;
    /** Easing animasi (linear / ease / custom) */
    easing?: Easing | Easing[];
    /** Callback ketika animasi terakhir selesai */
    onAnimationComplete?: () => void;
    /** Durasi tiap tahap animasi */
    stepDuration?: number;
};

/**
 * Utility:
 * Menggabungkan snapshot animasi awal + tahap animasi menjadi keyframes multi-step
 */
const buildKeyframes = (
    from: Record<string, string | number>,
    steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
    const keys = new Set<string>([
        ...Object.keys(from),
        ...steps.flatMap(step => Object.keys(step))
    ]);

    const result: Record<string, Array<string | number>> = {};

    keys.forEach(key => {
        result[key] = [from[key], ...steps.map(step => step[key])];
    });

    return result;
};

/**
 * BlurText Component
 */
const BlurText: React.FC<BlurTextProps> = ({
    text = '',
    delay = 200,
    className = '',
    animateBy = 'words',
    direction = 'top',
    threshold = 0.1,
    rootMargin = '0px',
    animationFrom,
    animationTo,
    easing = (t: number) => t,
    onAnimationComplete,
    stepDuration = 0.35
}) => {
    /**
     * Pisahkan teks menjadi array (kata atau huruf)
     */
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    /**
     * State: apakah elemen sudah terlihat di viewport?
     */
    const [inView, setInView] = useState(false);

    /**
     * Ref untuk observer (mengawasi <p>)
     */
    const ref = useRef<HTMLParagraphElement>(null);

    /**
     * IntersectionObserver untuk memicu animasi ketika elemen terlihat
     */
    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(ref.current as Element); // Stop pemantauan setelah terpicu
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    /**
     * Snapshot animasi default (masuk dari atas/bawah)
     */
    const defaultFrom = useMemo(
        () =>
            direction === 'top'
                ? { filter: 'blur(10px)', opacity: 0, y: -50 }
                : { filter: 'blur(10px)', opacity: 0, y: 50 },
        [direction]
    );

    /**
     * Tahap animasi default
     * (blur → semi blur → clear)
     */
    const defaultTo = useMemo(
        () => [
            {
                filter: 'blur(5px)',
                opacity: 0.5,
                y: direction === 'top' ? 5 : -5
            },
            { filter: 'blur(0px)', opacity: 1, y: 0 }
        ],
        [direction]
    );

    /**
     * Gunakan custom snapshot kalau disediakan
     */
    const fromSnapshot = animationFrom ?? defaultFrom;
    const toSnapshots = animationTo ?? defaultTo;

    /**
     * Hitung durasi & timeline animasi multi-step
     */
    const stepCount = toSnapshots.length + 1;
    const totalDuration = stepDuration * (stepCount - 1);
    const times = Array.from(
        { length: stepCount },
        (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1))
    );

    /**
     * Render animasi sebagai <span> per-segmen
     */
    return (
        <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
            {elements.map((segment, index) => {
                const keyframes = buildKeyframes(fromSnapshot, toSnapshots);

                const spanTransition: Transition = {
                    duration: totalDuration,
                    times,
                    delay: (index * delay) / 1000, // per elemen
                    ease: easing
                };

                return (
                    <motion.span
                        key={index}
                        initial={fromSnapshot}
                        animate={inView ? keyframes : fromSnapshot}
                        transition={spanTransition}
                        onAnimationComplete={
                            index === elements.length - 1
                                ? onAnimationComplete
                                : undefined
                        }
                        style={{
                            display: 'inline-block',
                            willChange: 'transform, filter, opacity'
                        }}
                    >
                        {/* gunakan non-breaking-space agar spasi ditampilkan */}
                        {segment === ' ' ? '\u00A0' : segment}
                        {animateBy === 'words' &&
                            index < elements.length - 1 &&
                            '\u00A0'}
                    </motion.span>
                );
            })}
        </p>
    );
};

export default BlurText;
