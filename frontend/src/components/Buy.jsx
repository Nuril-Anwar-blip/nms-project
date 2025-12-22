/**
 * Buy/Purchase Component
 * 
 * Halaman untuk memilih dan membeli paket NMS
 * 
 * PROPS: Tidak ada props
 * 
 * MODIFIKASI TAMPILAN:
 * - Ubah paket: Edit array packages, tambah/kurangi paket
 * - Ubah harga: Edit field price di setiap paket
 * - Ubah fitur: Edit array features di setiap paket
 * - Ubah warna: Edit className gradient dan color
 * - Ubah form checkout: Edit field di formData
 * - Ubah payment method: Edit array paymentMethods
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Buy() {
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [showCheckout, setShowCheckout] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        paymentMethod: 'bank_transfer'
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Paket yang tersedia - Edit di sini untuk menambah/mengubah paket
    const packages = [
        {
            id: 'starter',
            name: 'Starter',
            price: 0,
            period: 'bulan',
            popular: false,
            description: 'Cocok untuk pemula',
            features: [
                'Hingga 5 OLT',
                'Monitoring Dasar',
                'Email Support',
                '1 User Account',
                'Basic Reports'
            ]
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 500000,
            period: 'bulan',
            popular: true,
            description: 'Paling populer untuk bisnis',
            features: [
                'Hingga 50 OLT',
                'Semua Fitur Monitoring',
                'Auto Provisioning',
                'Priority Support',
                'Advanced Reports',
                'API Access',
                '5 User Accounts'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 0,
            period: 'custom',
            popular: false,
            description: 'Solusi khusus untuk perusahaan besar',
            features: [
                'Unlimited OLT',
                'Custom Integration',
                'Dedicated Support',
                'SLA Guarantee',
                'Custom Reports',
                'Full API Access',
                'Unlimited Users',
                'On-premise Option'
            ]
        }
    ]

    // Metode pembayaran - Edit di sini
    const paymentMethods = [
        { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
        { id: 'credit_card', name: 'Credit Card', icon: '💳' },
        { id: 'e_wallet', name: 'E-Wallet', icon: '📱' },
        { id: 'crypto', name: 'Cryptocurrency', icon: '₿' }
    ]

    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg)
        setShowCheckout(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: Implementasi API checkout
            // const response = await fetch('/api/checkout', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     package: selectedPackage,
            //     ...formData
            //   })
            // })

            // Simulasi checkout
            setTimeout(() => {
                alert('Pesanan berhasil! Kami akan menghubungi Anda segera.')
                navigate('/dashboard')
                setLoading(false)
            }, 1500)
        } catch (err) {
            alert('Terjadi kesalahan. Silakan coba lagi.')
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const formatPrice = (price) => {
        if (price === 0) return 'Gratis'
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            NMS ZTE OLT
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-700 hover:text-blue-600">Beranda</Link>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {!showCheckout ? (
                /* Package Selection */
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Pilih Paket yang Tepat
                        </h1>
                        <p className="text-xl text-gray-600">
                            Mulai dari paket gratis hingga solusi enterprise
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all transform hover:scale-105 ${pkg.popular ? 'ring-4 ring-blue-500 scale-105' : ''
                                    }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                                        POPULER
                                    </div>
                                )}

                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                                    <p className="text-gray-600 mb-6">{pkg.description}</p>

                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-blue-600">
                                            {formatPrice(pkg.price)}
                                        </span>
                                        {pkg.price > 0 && (
                                            <span className="text-gray-600">/{pkg.period}</span>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {pkg.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="text-green-500 mr-2 mt-1">✓</span>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handleSelectPackage(pkg)}
                                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${pkg.popular
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {pkg.price === 0 ? 'Mulai Gratis' : 'Pilih Paket'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Checkout Form */
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <div className="mb-8">
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                            >
                                ← Kembali ke pilihan paket
                            </button>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Checkout - {selectedPackage.name}
                            </h2>
                            <div className="text-2xl font-bold text-blue-600">
                                {formatPrice(selectedPackage.price)}
                                {selectedPackage.price > 0 && `/${selectedPackage.period}`}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Lengkap *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="nama@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor Telepon *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="081234567890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Perusahaan
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="PT. Contoh"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Alamat lengkap"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Metode Pembayaran *
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {paymentMethods.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === method.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={formData.paymentMethod === method.id}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="text-3xl mb-2">{method.icon}</span>
                                            <span className="text-sm font-medium text-gray-700">{method.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Paket</span>
                                        <span className="font-medium">{selectedPackage.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Harga</span>
                                        <span className="font-medium">{formatPrice(selectedPackage.price)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="font-bold text-lg text-blue-600">
                                                {formatPrice(selectedPackage.price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

