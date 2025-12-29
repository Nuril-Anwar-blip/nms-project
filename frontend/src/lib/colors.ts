/**
 * File: lib/colors.ts
 * 
 * Definisi warna untuk seluruh aplikasi NMS
 * Digunakan untuk konsistensi theme dan kemudahan maintenance
 */

export const colors = {
    // Primary & Secondary Colors
    primary: '#5227FF',        // Purple primary
    secondary: '#8B5CF6',      // Purple secondary

    // Background Colors
    background: {
        light: '#FFFFFF',        // Background light mode
        dark: '#071026',         // Background dark mode (default)
        section: '#0a1220',      // Section background dark
        cardDark: '#0b1220',     // Card background dark
        footer: '#06101a',       // Footer background dark
    },

    // Text Colors
    text: {
        primary: '#FFFFFF',      // Primary text (dark mode)
        secondary: '#D1D5DB',    // Secondary text (dark mode)
        muted: '#9CA3AF',        // Muted text (dark mode)
        dark: '#1F2937',         // Text untuk light mode
    },

    // Button Colors
    button: {
        primary: '#3B82F6',      // Blue button
        primaryHover: '#2563EB', // Blue button hover
        secondary: '#6B7280',    // Gray button
        secondaryHover: '#4B5563', // Gray button hover
    },

    // Border Colors
    border: {
        light: '#E5E7EB',        // Border light mode
        dark: '#1F2937',         // Border dark mode
    },

    // Accent Colors (untuk icons & highlights)
    accent: {
        blue: '#3B82F6',         // Blue accent
        purple: '#A855F7',       // Purple accent
        green: '#22C55E',        // Green accent
        yellow: '#EAB308',       // Yellow accent
        red: '#EF4444',          // Red accent
    },

    // Status Colors
    status: {
        success: '#22C55E',      // Success green
        warning: '#EAB308',      // Warning yellow
        error: '#EF4444',        // Error red
        info: '#3B82F6',         // Info blue
    },

    // Gradient Colors (untuk hero section)
    heroStart: '#071026',      // Hero gradient start
    heroEnd: '#0a1220',        // Hero gradient end
};