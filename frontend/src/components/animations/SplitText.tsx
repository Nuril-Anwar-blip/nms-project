/**
 * File: SplitText.tsx
 * Deskripsi:
 * Komponen ini melakukan animasi pada teks dengan memisahkannya menjadi karakter atau kata,
 * kemudian melakukan animasi menggunakan GSAP (from → to).
 * 
 * Fitur:
 * - Animasi berdasarkan karakter atau kata
 * - Bisa mengatur delay, durasi, easing, dan style awal/akhir animasi
 * - Callback ketika animasi elemen terakhir selesai
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Props yang dapat dikustomisasi
 */
interface SplitTextProps {
    /** Teks yang ingin dianimasikan */
    text: string;
    /** Class tambahan untuk styling */
    className?: string;
    /** Delay sebelum animasi berjalan (dalam detik) */
    delay?: number;
    /** Durasi animasi (dalam detik) */
    duration?: number;
    /** Easing GSAP, contoh: "power3.out", "expo.inOut" */
    ease?: string;
    /** Mode pemisahan teks: "chars" = karakter, "words" = kata */
    splitType?: "chars" | "words";
    /** State awal animasi GSAP (from) */
    from?: gsap.TweenVars;
    /** State akhir animasi GSAP (to) */
    to?: gsap.TweenVars;
    /** Callback saat animasi elemen terakhir selesai */
    onLetterAnimationComplete?: () => void;
}

export default function SplitText({
    text,
    className = "",
    delay = 1,
    duration = 0.6,
    ease = "power3.out",
    splitType = "chars",
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    onLetterAnimationComplete,
}: SplitTextProps) {

    // Referensi untuk membungkus teks yang telah dipisah
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        /**
         * Ambil semua span berdasarkan mode split:
         * - chars → langsung ambil semua span
         * - words → ambil span.word (word wrap)
         */
        const elements =
            splitType === "chars"
                ? ref.current.querySelectorAll("span")
                : ref.current.querySelectorAll("span.word");

        /**
         * GSAP animation (fromTo):
         * Menjalankan animasi dari state awal → akhir per elemen
         */
        gsap.fromTo(
            elements,
            from,
            {
                ...to,
                duration,
                delay,
                ease,
                stagger: 0.05, // jarak waktu antar animasi elemen
                onComplete: onLetterAnimationComplete,
            }
        );
    }, []);

    /**
     * Pecah teks menjadi karakter atau kata dalam bentuk <span>
     * sehingga bisa dianimasikan satu per satu
     */
    const content =
        splitType === "chars"
            ? text.split("").map((char, i) => (
                <span key={i} style={{ display: "inline-block" }}>
                    {char === " " ? "\u00A0" : char}
                </span>
            ))
            : text.split(" ").map((word, i) => (
                <span key={i} className="word inline-block mr-1">
                    {word}
                </span>
            ));

    return (
        <span ref={ref} className={className}>
            {content}
        </span>
    );
}
