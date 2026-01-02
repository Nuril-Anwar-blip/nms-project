/**
 * File: pages/LandingPage.tsx
 * Deskripsi: Landing page utama aplikasi NMS dengan berbagai komponen animasi interaktif
 * 
 * Fitur:
 * - Animasi teks menggunakan BlurText, SplitText, ShinyText
 * - Animasi angka menggunakan CountUp
 * - Background interaktif menggunakan DotGrid
 * - Grid fitur menggunakan MagicBento
 * - Scroll animation menggunakan ScrollVelocity, ScrollStackItem
 * - Smooth scroll navigation antar section
 * - Theme toggle (dark/light mode)
 * - Fully responsive design
 * 
 * Komponen Animasi yang Digunakan:
 * - BlurText: Untuk headline dengan efek blur saat muncul
 * - SplitText: Untuk teks yang terpisah per karakter/kata
 * - CountUp: Untuk statistik yang menghitung naik
 * - ShinyText: Untuk teks dengan efek shiny/shine
 * - ScrollVelocity: Untuk teks bergerak saat scroll
 * - DotGrid: Background interaktif dengan dots
 * - MagicBento: Grid card dengan efek interaktif
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { colors } from '../lib/colors'
import { useAuth } from '../hooks'
import DotGrid from '@/components/animations/DotGrid'
import MagicBento from '@/components/animations/MagicBento'
import { BlurText } from '@/components/animations'
import SplitText from '@/components/animations/SplitText'
import CountUp from '@/components/animations/CountUp'
import ShinyText from '@/components/animations/ShinyText'
import ScrollVelocity from '@/components/animations/ScrollVelocity'
import ScrollStack from '@/components/cards/ScrollStack'
import ScrollStackItem from '@/components/animations/ScrollStackItem'

/**
 * Komponen: LandingPage
 * 
 * Landing page utama dengan:
 * - Default theme: DARK
 * - Theme toggle button di navbar
 * - Semua warna dari colors.ts
 * - DotGrid fullscreen background
 * - Modern glassmorphism navbar
 * - Smooth scroll navigation
 * - Banyak komponen animasi untuk pengalaman yang menarik
 */
export default function LandingPage(): React.ReactElement {
  // State untuk theme (default: dark)
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Ref untuk smooth scroll
  const featuresRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Terapkan theme ke document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Redirect ke dashboard jika sudah login (hanya jika route dashboard ada)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Cek apakah route dashboard tersedia
      // Jika tidak ada, tetap di landing page
      try {
        navigate('/dashboard', { replace: true });
      } catch (error) {
        // Jika route tidak ada, tidak redirect
        console.log('Dashboard route not available, staying on landing page');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  /**
   * Fungsi: toggleTheme
   * Mengganti theme antara dark dan light mode
   */
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  /**
   * Fungsi: scrollToSection
   * Smooth scroll ke section tertentu dengan offset untuk navbar
   * 
   * @param sectionRef - Ref dari section yang dituju
   */
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement | null>) => {
    if (sectionRef.current) {
      const offset = 80; // Offset untuk navbar
      const elementPosition = sectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Komponen: ThemeToggle
   * Button untuk mengganti theme dark/light
   */
  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg transition-all duration-200 hover:scale-110"
      aria-label="Toggle theme"
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      }}
    >
      {isDark ? (
        // Sun Icon (untuk switch ke light)
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        // Moon Icon (untuk switch ke dark)
        <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );

  /**
   * Komponen: Navbar
   * Navbar dengan glassmorphism effect dan smooth scroll navigation
   */
  const Navbar = (): React.ReactElement => {
    const [open, setOpen] = useState(false);

    return (
      <nav
        className="w-full fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: isDark
            ? 'linear-gradient(to bottom, rgba(7, 16, 38, 0.95), rgba(7, 16, 38, 0.85), rgba(7, 16, 38, 0.7))'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.7))',
          borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          boxShadow: isDark
            ? '0 4px 24px rgba(0, 0, 0, 0.3)'
            : '0 4px 24px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo dengan link ke home */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-transform duration-200 group-hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              N
            </div>
            <div
              className="font-bold text-xl tracking-tight"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              NMS <span style={{ color: colors.primary }}>Zetset</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Navigation Links dengan smooth scroll */}
            <button
              onClick={() => scrollToSection(featuresRef)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection(statsRef)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Stats
            </button>
            <button
              onClick={() => scrollToSection(pricingRef)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Pricing
            </button>

            {/* Divider */}
            <div
              className="w-px h-6 mx-2"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
              }}
            />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Action Buttons */}
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`,
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              aria-label="menu"
              onClick={() => setOpen(v => !v)}
              className="p-2.5 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
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
                {open ? (
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div
            className="md:hidden px-6 pb-6 space-y-3 border-t"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              backgroundColor: isDark ? 'rgba(7, 16, 38, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            }}
          >
            <button
              onClick={() => {
                scrollToSection(featuresRef);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg font-medium"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              Features
            </button>
            <button
              onClick={() => {
                scrollToSection(statsRef);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg font-medium"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              Stats
            </button>
            <button
              onClick={() => {
                scrollToSection(pricingRef);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg font-medium"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              Pricing
            </button>
            <Link
              to="/login"
              className="block w-full text-center px-4 py-3 rounded-lg font-medium"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
              }}
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block w-full text-center px-4 py-3 rounded-lg text-white font-medium shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`,
              }}
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    );
  };

  /**
   * Komponen: Hero
   * Hero section dengan DotGrid background dan animasi teks
   */
  const Hero = () => {
    return (
      <section
        className="w-full relative overflow-hidden"
        style={{
          backgroundColor: isDark ? colors.background.dark : colors.background.light,
          minHeight: '100vh',
          paddingTop: '80px' // Space untuk navbar
        }}
      >
        {/* DotGrid Background - Fullscreen dari navbar sampai hero */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.5
          }}
        >
          <DotGrid
            dotSize={4}
            gap={20}
            baseColor={isDark ? colors.text.secondary : '#9CA3AF'}
            activeColor={colors.primary}
            proximity={100}
            shockRadius={150}
            shockStrength={4}
            resistance={900}
            returnDuration={1.2}
          />
        </div>

        {/* Gradient Overlay - Fade effect dari atas ke bawah */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '400px',
            background: isDark
              ? 'linear-gradient(to bottom, rgba(7, 16, 38, 0.9), rgba(7, 16, 38, 0.5), transparent)'
              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5), transparent)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            {/* Badge dengan animasi */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: isDark ? 'rgba(82, 39, 255, 0.15)' : 'rgba(82, 39, 255, 0.1)',
                color: colors.primary,
                border: `1px solid ${isDark ? 'rgba(82, 39, 255, 0.3)' : 'rgba(82, 39, 255, 0.2)'}`
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: colors.primary }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: colors.primary }} />
              </span>
              Modern Network Management System
            </div>

            {/* Heading dengan SplitText animasi */}
            <h1
              className="text-5xl md:text-6xl font-extrabold leading-tight"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark,
              }}
            >
              <SplitText
                text="Solusi NMS untuk Infrastruktur Jaringan"
                splitType="words"
                delay={0.5}
                duration={0.8}
                ease="power3.out"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                className="block"
              />
            </h1>

            {/* Description dengan BlurText animasi */}
            <div
              className="text-xl leading-relaxed"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              <BlurText
                text="Kelola perangkat, monitoring real-time, provisioning otomatis — semuanya dalam satu platform yang mudah digunakan."
                animateBy="words"
                direction="top"
                delay={100}
                className="block"
              />
            </div>

            {/* Stats dengan CountUp animasi */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.primary }}
                >
                  <CountUp to={99.9} from={0} duration={2} separator="." />%
                </div>
                <div
                  className="text-sm"
                  style={{ color: isDark ? colors.text.secondary : colors.text.muted }}
                >
                  Uptime
                </div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.primary }}
                >
                  <CountUp to={1000000} from={0} duration={2.5} separator="," />+
                </div>
                <div
                  className="text-sm"
                  style={{ color: isDark ? colors.text.secondary : colors.text.muted }}
                >
                  Devices Managed
                </div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: colors.primary }}
                >
                  24/7
                </div>
                <div
                  className="text-sm"
                  style={{ color: isDark ? colors.text.secondary : colors.text.muted }}
                >
                  Support
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`,
                  boxShadow: `0 8px 24px ${colors.button.primary}40`
                }}
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105"
                style={{
                  color: isDark ? colors.text.primary : colors.text.dark,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
                }}
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: isDark ? colors.background.dark : colors.background.light,
                      color: 'white'
                    }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div
                className="text-sm"
                style={{ color: isDark ? colors.text.secondary : colors.text.muted }}
              >
                Trusted by <span className="font-semibold" style={{ color: colors.primary }}>10,000+</span> companies worldwide
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center md:justify-end">
            <div
              className="relative"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))'
              }}
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${colors.primary}40, transparent)`,
                  transform: 'scale(1.1)'
                }}
              />

              {/* Main SVG */}
              <svg
                width="500"
                height="400"
                viewBox="0 0 500 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-full h-auto relative"
              >
                {/* Background Card */}
                <rect
                  x="50"
                  y="50"
                  width="400"
                  height="300"
                  rx="24"
                  fill={isDark ? '#0b1220' : '#EFF6FF'}
                  stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                  strokeWidth="2"
                />

                {/* Dashboard Elements */}
                <g transform="translate(80,80)">
                  {/* Header */}
                  <rect x="0" y="0" width="340" height="40" rx="8" fill={colors.primary} opacity="0.2" />
                  <circle cx="20" cy="20" r="8" fill={colors.primary} />

                  {/* Stats Cards */}
                  <rect x="0" y="60" width="100" height="80" rx="12" fill={colors.accent.blue} opacity="0.15" />
                  <rect x="120" y="60" width="100" height="80" rx="12" fill={colors.accent.green} opacity="0.15" />
                  <rect x="240" y="60" width="100" height="80" rx="12" fill={colors.accent.purple} opacity="0.15" />

                  {/* Chart */}
                  <path
                    d="M20 180 L80 160 L140 170 L200 140 L260 150 L320 130"
                    stroke={colors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Data Points */}
                  <circle cx="80" cy="160" r="4" fill={colors.primary} />
                  <circle cx="140" cy="170" r="4" fill={colors.primary} />
                  <circle cx="200" cy="140" r="4" fill={colors.primary} />
                  <circle cx="260" cy="150" r="4" fill={colors.primary} />

                  {/* Bottom Row */}
                  <rect x="0" y="210" width="160" height="50" rx="8" fill={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'} />
                  <rect x="180" y="210" width="160" height="50" rx="8" fill={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'} />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>
    );
  };

  /**
   * Komponen: Features
   * Section features dengan MagicBento grid dan animasi
   */
  const Features = () => (
    <section
      ref={featuresRef}
      id="features"
      className="py-24 relative"
      style={{
        backgroundColor: isDark ? colors.background.section : colors.background.light
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header dengan BlurText */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{
              backgroundColor: isDark ? 'rgba(82, 39, 255, 0.15)' : 'rgba(82, 39, 255, 0.1)',
              color: colors.primary
            }}
          >
            Our Features
          </div>
          <div
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            <BlurText
              text="Everything You Need"
              animateBy="words"
              direction="top"
              delay={50}
              className="block"
            />
          </div>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Powerful tools and features to manage your entire network infrastructure from a single, intuitive platform
          </p>
        </div>

        {/* MagicBento Grid */}
        <div className="flex justify-center mb-20">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              ),
              title: 'Real-time Monitoring',
              description: 'Track device status and critical metrics continuously with an interactive dashboard',
              color: colors.accent.blue,
              bgColor: 'rgba(59, 130, 246, 0.15)'
            },
            {
              icon: (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </>
              ),
              title: 'Auto Provisioning',
              description: 'Centralized configuration and device provisioning with intelligent automation',
              color: colors.accent.purple,
              bgColor: 'rgba(168, 85, 247, 0.15)'
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              ),
              title: 'Smart Alerts',
              description: 'Get instant notifications and detailed reports for critical events and performance trends',
              color: colors.accent.green,
              bgColor: 'rgba(34, 197, 94, 0.15)'
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: isDark ? colors.background.cardDark : colors.background.light,
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                boxShadow: isDark
                  ? '0 4px 24px rgba(0, 0, 0, 0.2)'
                  : '0 4px 24px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-center mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: isDark ? feature.bgColor : feature.bgColor.replace('0.15', '0.1')
                  }}
                >
                  <svg className="w-7 h-7" style={{ color: feature.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  color: isDark ? colors.text.primary : colors.text.dark
                }}
              >
                {feature.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  color: isDark ? colors.text.secondary : colors.text.muted
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /**
   * Komponen: Stats
   * Section statistik dengan CountUp animasi
   */
  const Stats = () => (
    <section
      ref={statsRef}
      id="stats"
      className="py-24 relative overflow-hidden"
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${colors.background.dark}, ${colors.background.section})`
          : `linear-gradient(135deg, ${colors.background.light}, rgba(249, 250, 251, 1))`
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.primary} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{
            backgroundColor: isDark ? 'rgba(82, 39, 255, 0.15)' : 'rgba(82, 39, 255, 0.1)',
            color: colors.primary
          }}
        >
          Our Achievements
        </div>
        <div
          className="text-4xl md:text-5xl font-bold mb-12"
          style={{
            color: isDark ? colors.text.primary : colors.text.dark
          }}
        >
          <ShinyText
            text="Numbers That Speak"
            speed={3}
            className="block"
            disabled={false}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { value: 10000, suffix: '+', label: 'Active Users', duration: 2 },
            { value: 99.9, suffix: '%', label: 'Uptime', duration: 2, decimals: 1 },
            { value: 5000000, suffix: '+', label: 'Devices Managed', duration: 2.5 },
            { value: 150, suffix: '+', label: 'Countries', duration: 2 }
          ].map((stat, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: isDark ? colors.background.cardDark : colors.background.light,
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                boxShadow: isDark
                  ? '0 4px 24px rgba(0, 0, 0, 0.2)'
                  : '0 4px 24px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: colors.primary }}
              >
                {stat.decimals ? (
                  <>
                    <CountUp
                      to={stat.value}
                      from={0}
                      duration={stat.duration}
                      separator="."
                    />
                    {stat.suffix}
                  </>
                ) : (
                  <>
                    <CountUp
                      to={stat.value}
                      from={0}
                      duration={stat.duration}
                      separator={stat.value > 1000 ? ',' : ''}
                    />
                    {stat.suffix}
                  </>
                )}
              </div>
              <div
                className="text-lg font-medium"
                style={{
                  color: isDark ? colors.text.secondary : colors.text.muted
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /**
   * Komponen: ScrollVelocitySection
   * Section dengan teks bergerak saat scroll
   */
  const ScrollVelocitySection = () => (
    <section className="py-16 relative overflow-hidden" style={{
      backgroundColor: isDark ? colors.background.section : colors.background.light
    }}>
      <div style={{
        color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }}>
        <ScrollVelocity
          text="Trusted by Industry Leaders • Enterprise Grade • Scalable Solutions • 24/7 Support • "
          speed={50}
          className="text-2xl md:text-4xl font-bold"
        />
      </div>
    </section>
  );

  /**
   * Komponen: Pricing
   * Section pricing dengan animasi
   */
  const Pricing = () => (
    <section
      ref={pricingRef}
      id="pricing"
      className="py-24 relative"
      style={{
        backgroundColor: isDark ? colors.background.section : colors.background.light
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{
              backgroundColor: isDark ? 'rgba(82, 39, 255, 0.15)' : 'rgba(82, 39, 255, 0.1)',
              color: colors.primary
            }}
          >
            Pricing
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Simple, Transparent Pricing
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Choose the plan that fits your needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: 'Free',
              description: 'Perfect for small teams',
              features: ['Up to 100 devices', 'Basic monitoring', 'Email support', 'Community access']
            },
            {
              name: 'Professional',
              price: '$99',
              description: 'For growing businesses',
              features: ['Up to 10,000 devices', 'Advanced monitoring', 'Priority support', 'API access', 'Custom integrations'],
              popular: true
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              description: 'For large organizations',
              features: ['Unlimited devices', 'Full feature access', '24/7 dedicated support', 'Custom SLA', 'On-premise option']
            }
          ].map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${plan.popular ? `ring-2 ring-offset-2` : ''
                }`}
              style={{
                backgroundColor: isDark ? colors.background.cardDark : colors.background.light,
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                boxShadow: isDark
                  ? '0 4px 24px rgba(0, 0, 0, 0.2)'
                  : '0 4px 24px rgba(0, 0, 0, 0.05)',
                ...(plan.popular && {
                  outline: `2px solid ${colors.primary}`,
                  outlineOffset: '2px'
                })
              } as React.CSSProperties}
            >
              {plan.popular && (
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{
                    backgroundColor: 'rgba(82, 39, 255, 0.15)',
                    color: colors.primary
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3
                className="text-2xl font-bold mb-2"
                style={{
                  color: isDark ? colors.text.primary : colors.text.dark
                }}
              >
                {plan.name}
              </h3>
              <div className="mb-4">
                <span
                  className="text-4xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {plan.price}
                </span>
                {plan.price !== 'Free' && plan.price !== 'Custom' && (
                  <span
                    className="text-lg"
                    style={{
                      color: isDark ? colors.text.secondary : colors.text.muted
                    }}
                  >
                    /month
                  </span>
                )}
              </div>
              <p
                className="mb-6"
                style={{
                  color: isDark ? colors.text.secondary : colors.text.muted
                }}
              >
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: colors.accent.green }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span
                      style={{
                        color: isDark ? colors.text.secondary : colors.text.muted
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to={plan.price === 'Free' ? '/register' : '/register'}
                className="block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: plan.popular
                    ? `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`
                    : isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  color: plan.popular ? 'white' : isDark ? colors.text.primary : colors.text.dark,
                  border: plan.popular
                    ? 'none'
                    : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  background: plan.popular
                    ? `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`
                    : undefined
                }}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /**
   * Komponen: CTASection
   * Call to Action section dengan animasi
   */
  const CTASection = () => (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${colors.background.dark}, ${colors.background.section})`
          : `linear-gradient(135deg, ${colors.background.light}, rgba(249, 250, 251, 1))`
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.primary} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
          style={{
            backgroundColor: isDark ? 'rgba(82, 39, 255, 0.15)' : 'rgba(82, 39, 255, 0.1)',
            color: colors.primary
          }}
        >
          Ready to Get Started?
        </div>
        <div
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{
            color: isDark ? colors.text.primary : colors.text.dark
          }}
        >
          <BlurText
            text="Transform Your Network Management Today"
            animateBy="words"
            direction="top"
            delay={50}
            className="block"
          />
        </div>
        <p
          className="text-xl mb-10"
          style={{
            color: isDark ? colors.text.secondary : colors.text.muted
          }}
        >
          Join thousands of companies managing their infrastructure with our powerful platform
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-10 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-xl w-full sm:w-auto"
            style={{
              background: `linear-gradient(135deg, ${colors.button.primary}, ${colors.button.primaryHover})`,
              boxShadow: `0 8px 24px ${colors.button.primary}40`
            }}
          >
            Start Free Trial
          </Link>
          <button
            onClick={() => scrollToSection(contactRef)}
            className="px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 w-full sm:w-auto"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`
            }}
          >
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );

  /**
   * Komponen: Footer
   * Footer dengan informasi kontak dan links
   */
  const Footer = (): React.ReactElement => (
    <footer
      ref={contactRef}
      id="contact"
      style={{
        backgroundColor: isDark ? colors.background.footer : colors.background.light,
        borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              N
            </div>
            <div
              className="font-bold text-xl"
              style={{
                color: isDark ? colors.text.primary : colors.text.dark
              }}
            >
              NMS Zetset
            </div>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: isDark ? colors.text.secondary : colors.text.muted
            }}
          >
            Modern network management solutions for operators and service providers.
          </p>
        </div>

        {/* Product Column */}
        <div>
          <h4
            className="font-bold mb-4 text-lg"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Product
          </h4>
          <ul className="space-y-3">
            {['Features', 'Pricing', 'Enterprise', 'API'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => {
                    if (item === 'Features') scrollToSection(featuresRef);
                    if (item === 'Pricing') scrollToSection(pricingRef);
                  }}
                  className="text-sm hover:underline transition-colors text-left"
                  style={{
                    color: isDark ? colors.text.secondary : colors.text.muted
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4
            className="font-bold mb-4 text-lg"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Company
          </h4>
          <ul className="space-y-3">
            {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-sm hover:underline transition-colors"
                  style={{
                    color: isDark ? colors.text.secondary : colors.text.muted
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4
            className="font-bold mb-4 text-lg"
            style={{
              color: isDark ? colors.text.primary : colors.text.dark
            }}
          >
            Get in Touch
          </h4>
          <ul className="space-y-3">
            <li
              className="text-sm"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              support@nmszetset.com
            </li>
            <li
              className="text-sm"
              style={{
                color: isDark ? colors.text.secondary : colors.text.muted
              }}
            >
              +62 21 0000 0000
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-sm"
            style={{
              color: isDark ? colors.text.muted : colors.text.secondary
            }}
          >
            © {new Date().getFullYear()} NMS Zetset. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm hover:underline"
                style={{
                  color: isDark ? colors.text.muted : colors.text.secondary
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );

  // Render utama - tampilkan loading jika sedang check auth
  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: isDark ? colors.background.dark : colors.background.light
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              borderTopColor: colors.primary
            }}
          ></div>
          <p style={{ color: isDark ? colors.text.secondary : colors.text.muted }}>Loading...</p>
        </div>
      </main>
    );
  }

  // Jika sudah authenticated, tetap tampilkan landing page
  // (redirect akan dihandle oleh useEffect, tapi jika route tidak ada, tetap tampilkan)

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: isDark ? colors.background.dark : colors.background.light
      }}
    >
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <ScrollVelocitySection />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  );
}
