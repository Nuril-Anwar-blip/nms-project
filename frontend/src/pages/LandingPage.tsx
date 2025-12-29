/** AUTO-DOC: src/pages/LandingPage.tsx
 * Deskripsi: Komponen landing page dengan dark theme default dan theme toggle
 * Catatan: Menggunakan colors.ts untuk semua warna
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../lib/colors'
import DotGrid from '@/components/animations/DotGrid'
import MagicBento from '@/components/animations/MagicBento'

/**
 * Komponen: LandingPage
 * - Default theme: DARK
 * - Theme toggle button di navbar
 * - Semua warna dari colors.ts
 */
export default function LandingPage(): React.ReactElement {
  // Theme State (default: dark)
  const [isDark, setIsDark] = useState(true);

  // Apply theme ke document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  /**
   * Toggle Theme Function
   */
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  /**
   * Theme Toggle Button Component
   */
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Sun Icon (untuk switch ke light)
        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        // Moon Icon (untuk switch ke dark)
        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );

  /**
   * Navbar dengan Theme Toggle
   */
  const Navbar = (): React.ReactElement => {
    const [open, setOpen] = useState(false);

    return (
      <nav
        className="w-full relative z-20"
        style={{
          backgroundColor: isDark ? colors.background.dark : colors.background.light
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: colors.primary
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            >
              N
            </div>
            <div
              className="font-semibold text-lg"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              NMS Zetset
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-sm">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              to="/login"
              className="px-4 py-2 rounded-md text-white"
              style={{
                backgroundColor: colors.button.primary
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-md"
              style={{
                borderWidth: '2px',
                borderColor: isDark ? colors.border.dark : colors.border.light,
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              aria-label="menu"
              onClick={() => setOpen(v => !v)}
              className="p-2 rounded-md"
              style={{
                borderWidth: '1px',
                borderColor: isDark ? colors.border.dark : colors.border.light
              }}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                style={{
                  color: isDark ? colors.text.primary : colors.text.dark
                }}
              >
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu content */}
        {open && (
          <div className="md:hidden px-6 pb-4 space-y-3">
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 rounded-md text-white"
              style={{
                backgroundColor: colors.button.primary
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block w-full text-center px-4 py-2 rounded-md"
              style={{
                borderWidth: '1px',
                borderColor: isDark ? colors.border.dark : colors.border.light,
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    );
  };

  /**
   * Hero Section dengan Dark Theme Default
   */
  const Hero = () => {
    return (
      <section
        className="w-full relative overflow-hidden"
        style={{
          backgroundColor: isDark ? colors.background.dark : colors.background.light
        }}
      >
        {/* DotGrid Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minHeight: '600px',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.6
          }}
        >
          <DotGrid
            dotSize={10}
            gap={15}
            baseColor={colors.primary}
            activeColor={colors.secondary}
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1
              className="text-4xl md:text-5xl font-extrabold leading-tight"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              Solusi NMS untuk Infrastruktur Jaringan
            </h1>
            <p
              className="text-lg"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              Kelola perangkat, monitoring real-time, provisioning otomatis — semuanya dalam satu platform yang mudah digunakan.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              {/* Button Masuk */}
              <Link
                to="/login"
                className="px-6 py-3 rounded-md text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: colors.button.primary,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.button.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button.primary}
              >
                Masuk
              </Link>

              {/* Button Daftar */}
              <Link
                to="/register"
                className="px-6 py-3 rounded-md font-medium transition-colors duration-200"
                style={{
                  borderWidth: '1px',
                  borderColor: isDark ? colors.border.dark : colors.border.light,
                  color: isDark ? colors.text.secondary : colors.text.dark,
                  backgroundColor: isDark ? colors.background.cardDark : colors.background.light
                }}
              >
                Daftar
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center md:justify-end">
            <svg
              width="360"
              height="260"
              viewBox="0 0 360 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-full h-auto drop-shadow-lg"
            >
              <rect
                x="0"
                y="0"
                width="360"
                height="260"
                rx="16"
                fill={isDark ? '#1e3a8a' : '#EFF6FF'}
              />
              <g transform="translate(40,40)" fill={isDark ? '#60a5fa' : '#0f62fe'}>
                <circle cx="40" cy="40" r="28" opacity="0.12" />
                <rect x="90" y="20" width="120" height="80" rx="8" opacity="0.12" />
                <path
                  d="M20 140h220"
                  stroke={isDark ? '#60a5fa' : '#0f62fe'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Features Section dengan Dark Theme
   */
  const Features = () => (
    <section
      className="py-20"
      style={{
        backgroundColor: isDark ? colors.background.section : colors.background.light
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Fitur Unggulan
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Solusi lengkap untuk mengelola infrastruktur jaringan Anda dengan teknologi terkini
          </p>
        </div>

        {/* MagicBento Grid */}
        <div className="flex justify-center mb-16">
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div
            className="group p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: isDark ? colors.background.cardDark : colors.background.light,
              borderWidth: '1px',
              borderColor: isDark ? colors.border.dark : colors.border.light
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                }}
              >
                <svg className="w-6 h-6" style={{ color: colors.accent.blue }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              Monitoring Real-time
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              Pantau status perangkat dan metrik penting secara terus-menerus dengan dashboard interaktif.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div
            className="group p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: isDark ? colors.background.cardDark : colors.background.light,
              borderWidth: '1px',
              borderColor: isDark ? colors.border.dark : colors.border.light
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)'
                }}
              >
                <svg className="w-6 h-6" style={{ color: colors.accent.purple }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              Provisioning Otomatis
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              Kelola konfigurasi dan provisioning perangkat secara terpusat dengan otomasi cerdas.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div
            className="group p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: isDark ? colors.background.cardDark : colors.background.light,
              borderWidth: '1px',
              borderColor: isDark ? colors.border.dark : colors.border.light
            }}
          >
            <div className="flex items-center mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
                }}
              >
                <svg className="w-6 h-6" style={{ color: colors.accent.green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              Laporan & Alarm
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              Dapatkan notifikasi dan laporan untuk kejadian kritis dan tren performa jaringan.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div
            className="inline-flex items-center gap-3 p-6 rounded-2xl"
            style={{
              background: isDark
                ? 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))'
                : 'linear-gradient(to right, rgba(239, 246, 255, 1), rgba(250, 245, 255, 1))',
              borderWidth: '1px',
              borderColor: isDark ? colors.border.dark : colors.border.light
            }}
          >
            <svg className="w-5 h-5" style={{ color: colors.accent.blue }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p
              className="text-sm"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              <strong className="font-semibold">Pro Tip:</strong> Hover dan klik pada kartu di atas untuk melihat efek interaktif!
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  /**
   * Logos Section
   */
  const Logos = () => (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-32 h-12 rounded-md flex items-center justify-center text-sm shadow-sm"
              style={{
                backgroundColor: isDark ? colors.background.cardDark : colors.background.light,
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              Logo {i + 1}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /**
   * Footer
   */
  const Footer = (): React.ReactElement => (
    <footer
      className="mt-16"
      style={{
        backgroundColor: isDark ? colors.background.footer : colors.background.light
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h4
            className="font-semibold mb-2"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            NMS Zetset
          </h4>
          <p
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Solusi manajemen jaringan modern untuk operator dan penyedia layanan.
          </p>
        </div>

        <div>
          <h4
            className="font-semibold mb-2"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Produk
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:underline"
                style={{
                  color: isDark ? colors.text.secondary : colors.text.muted
                }}
              >
                Monitoring
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline"
                style={{
                  color: isDark ? colors.text.secondary : colors.text.muted
                }}
              >
                Provisioning
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:underline"
                style={{
                  color: isDark ? colors.text.secondary : colors.text.muted
                }}
              >
                Laporan
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4
            className="font-semibold mb-2"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Kontak
          </h4>
          <p
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Email: support@example.com
          </p>
          <p
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Tel: +62 21 0000 0000
          </p>
        </div>
      </div>

      <div
        style={{
          borderTopWidth: '1px',
          borderColor: isDark ? colors.border.dark : colors.border.light
        }}
      >
        <div
          className="max-w-6xl mx-auto px-6 py-4 text-xs"
          style={{
            color: isDark ? colors.text.muted : colors.text.secondary
          }}
        >
          © {new Date().getFullYear()} NMS Zetset. All rights reserved.
        </div>
      </div>
    </footer>
  );

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: isDark ? colors.background.dark : colors.background.light,
        color: isDark ? colors.text.primary : colors.text.dark
      }}
    >
      <Navbar />
      <Hero />
      <Features />

      {/* CTA Section */}
      <section
        className="py-16"
        style={{
          background: isDark
            ? `linear-gradient(to bottom, ${colors.background.dark}, ${colors.background.section})`
            : `linear-gradient(to bottom, ${colors.background.light}, rgba(249, 250, 251, 1))`
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2
            className="text-2xl font-extrabold mb-4"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Siap untuk meningkatkan manajemen jaringan Anda?
          </h2>
          <p
            className="mb-6"
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Mulai dengan trial gratis atau jadwalkan demo bersama tim kami.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 text-white rounded-md"
              style={{
                backgroundColor: colors.button.primary
              }}
            >
              Coba Gratis
            </Link>
            <a
              href="#contact"
              className="px-6 py-3 rounded-md"
              style={{
                borderWidth: '1px',
                borderColor: isDark ? colors.border.dark : colors.border.light,
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              Jadwalkan Demo
            </a>
          </div>
        </div>
      </section>

      <Logos />
      <Footer />
    </main>
  );
}