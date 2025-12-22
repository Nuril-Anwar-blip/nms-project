/**
 * Landing Page Component dengan Layout Modern & Menarik
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah warna background: Edit gradient di hero section
 * - Ubah layout features: Edit grid columns
 * - Ubah pricing cards: Edit style di pricing section
 * - Tambah section baru: Duplikat section yang ada
 */
import { Link } from 'react-router-dom'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                📡
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                NMS ZTE OLT
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section dengan Layout Modern */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full">
                                <span className="text-blue-400 text-sm font-medium">✨ Platform Terdepan untuk NMS</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                                <span className="text-white">Network Management</span>
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    System untuk ZTE OLT
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                                Solusi lengkap untuk monitoring, provisioning, dan manajemen OLT ZTE C300/C320 dengan antarmuka modern dan fitur canggih yang memudahkan pengelolaan jaringan Anda.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 font-semibold text-lg"
                                >
                                    🚀 Mulai Gratis
                                </Link>
                                <Link
                                    to="/buy"
                                    className="px-8 py-4 bg-gray-800 border-2 border-gray-700 text-white rounded-xl hover:bg-gray-700 hover:border-gray-600 transition-all font-semibold text-lg"
                                >
                                    💰 Lihat Paket
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800">
                                <div>
                                    <div className="text-3xl font-bold text-white">100+</div>
                                    <div className="text-sm text-gray-400">OLT Terkelola</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">1000+</div>
                                    <div className="text-sm text-gray-400">ONU Aktif</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">99.9%</div>
                                    <div className="text-sm text-gray-400">Uptime</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Dashboard Preview dengan Gradient */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
                            <div className="relative bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl transform hover:scale-105 transition-all">
                                <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
                                    {/* Mock Dashboard */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <div className="text-xs text-gray-500">Dashboard Preview</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4">
                                            <div className="text-white text-sm opacity-80">OLTs</div>
                                            <div className="text-white text-2xl font-bold">24</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4">
                                            <div className="text-white text-sm opacity-80">ONUs</div>
                                            <div className="text-white text-2xl font-bold">1.2K</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-4">
                                            <div className="text-white text-sm opacity-80">Alarms</div>
                                            <div className="text-white text-2xl font-bold">3</div>
                                        </div>
                                    </div>
                                    <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
                                        <div className="text-gray-600 text-sm">📊 Network Graph</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section dengan Layout Grid Modern */}
            <section className="py-20 px-6 bg-gray-900 bg-opacity-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-2 bg-indigo-500 bg-opacity-20 border border-indigo-500 rounded-full mb-4">
                            <span className="text-indigo-400 text-sm font-medium">Fitur Unggulan</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Semua yang Anda Butuhkan
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Platform lengkap untuk mengelola jaringan OLT dengan mudah dan efisien
                        </p>
                    </div>

                    {/* Features Grid - 3 Kolom dengan Cards Menarik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Real-time Monitoring</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Pantau status OLT dan ONU secara real-time dengan dashboard interaktif yang memberikan insight mendalam tentang kesehatan jaringan Anda.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">⚙️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Auto Provisioning</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Provisioning ONU otomatis dengan konfigurasi PPPoE terintegrasi. Hemat waktu dan kurangi kesalahan manual dengan sistem yang cerdas.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-red-500 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🚨</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Alarm Management</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Sistem alarm canggih dengan notifikasi real-time dan severity levels. Dapatkan alert instan untuk masalah kritis sebelum berdampak pada layanan.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🗺️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Network Maps</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Visualisasi jaringan dengan peta interaktif untuk OLT dan ONU. Lihat topologi jaringan Anda dalam satu tampilan yang mudah dipahami.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🔗</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">API Integration</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Integrasi API yang powerful untuk koneksi dengan sistem eksternal. Mudah diintegrasikan dengan tools dan platform yang sudah Anda gunakan.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-cyan-500 transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">📈</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Advanced Analytics</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Analitik mendalam dengan laporan komprehensif dan trend analysis. Buat keputusan data-driven untuk optimasi jaringan Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section dengan Layout Modern */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-2 bg-green-500 bg-opacity-20 border border-green-500 rounded-full mb-4">
                            <span className="text-green-400 text-sm font-medium">Pricing</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Pilih Paket yang Tepat
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Mulai dari gratis hingga enterprise, ada paket untuk setiap kebutuhan
                        </p>
                    </div>

                    {/* Pricing Cards - 3 Kolom dengan Highlight */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Starter Plan */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all transform hover:scale-105">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                                <div className="mb-4">
                                    <span className="text-5xl font-extrabold text-white">Gratis</span>
                                </div>
                                <p className="text-gray-400">Cocok untuk testing dan development</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    Hingga 5 OLT
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    Hingga 100 ONU
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    Basic Monitoring
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    Email Support
                                </li>
                            </ul>
                            <Link
                                to="/register"
                                className="block w-full text-center px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold"
                            >
                                Mulai Gratis
                            </Link>
                        </div>

                        {/* Professional Plan - Popular */}
                        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 border-2 border-blue-400 transform scale-105 shadow-2xl shadow-blue-500/50">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                                    POPULER
                                </span>
                            </div>
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                                <div className="mb-4">
                                    <span className="text-5xl font-extrabold text-white">Rp 500K</span>
                                    <span className="text-gray-300">/bulan</span>
                                </div>
                                <p className="text-blue-100">Cocok untuk bisnis kecil-menengah</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-white">
                                    <span className="text-yellow-300 mr-3">✓</span>
                                    Hingga 50 OLT
                                </li>
                                <li className="flex items-center text-white">
                                    <span className="text-yellow-300 mr-3">✓</span>
                                    Unlimited ONU
                                </li>
                                <li className="flex items-center text-white">
                                    <span className="text-yellow-300 mr-3">✓</span>
                                    Full Monitoring & Alarms
                                </li>
                                <li className="flex items-center text-white">
                                    <span className="text-yellow-300 mr-3">✓</span>
                                    Auto Provisioning
                                </li>
                                <li className="flex items-center text-white">
                                    <span className="text-yellow-300 mr-3">✓</span>
                                    Priority Support
                                </li>
                                <li className="flex items-center text-white">
                                    <span className="text-yellow-300 mr-3">✓</span>
                                    API Access
                                </li>
                            </ul>
                            <Link
                                to="/buy"
                                className="block w-full text-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-lg"
                            >
                                Pilih Paket
                            </Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all transform hover:scale-105">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                                <div className="mb-4">
                                    <span className="text-5xl font-extrabold text-white">Custom</span>
                                </div>
                                <p className="text-gray-400">Solusi khusus untuk perusahaan besar</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    Unlimited OLT
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    Unlimited ONU
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    All Features
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    Custom Integration
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    24/7 Dedicated Support
                                </li>
                                <li className="flex items-center text-gray-300">
                                    <span className="text-green-500 mr-3">✓</span>
                                    SLA Guarantee
                                </li>
                            </ul>
                            <Link
                                to="/buy"
                                className="block w-full text-center px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold"
                            >
                                Hubungi Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Siap Memulai?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Bergabunglah dengan ratusan perusahaan yang sudah mempercayai NMS ZTE OLT untuk mengelola jaringan mereka
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/50 transform hover:scale-105 font-bold text-lg"
                        >
                            Daftar Sekarang - Gratis
                        </Link>
                        <Link
                            to="/buy"
                            className="px-8 py-4 bg-blue-800 border-2 border-blue-400 text-white rounded-xl hover:bg-blue-900 transition-all font-bold text-lg"
                        >
                            Lihat Paket
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    📡
                                </div>
                                <span className="text-xl font-bold text-white">NMS ZTE OLT</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Platform terdepan untuk Network Management System ZTE OLT
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Produk</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link to="/buy" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors">Documentation</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link to="/" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors">Kontak</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><Link to="/" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link to="/" className="hover:text-white transition-colors">API Docs</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                        © 2024 NMS ZTE OLT. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
