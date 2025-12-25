/**
 * File: components/SeverityBadge.tsx
 *
 * Komponen `SeverityBadge` menampilkan label tipis (pill) untuk severity atau
 * tipe activity dengan warna yang konsisten dan mudah dibedakan.
 *
 * Alasan desain:
 * - Memisahkan logika warna dari halaman agar mudah disesuaikan.
 * - Menggunakan warna yang tidak menyakitkan mata namun kontras untuk cepat terbaca.
 * - Ukuran dan padding ringan agar cocok untuk tabel dan header.
 *
 * Cara penggunaan:
 * <SeverityBadge value="critical" />
 * <SeverityBadge value="create" kind="activity" />
 *
 * Props:
 * - value: nilai label (string)
 * - kind: 'severity' | 'activity' (default 'severity')
 * - size: 'sm' | 'md' (default 'md')
 */



interface Props {
    value: string
    kind?: 'severity' | 'activity'
    size?: 'sm' | 'md'
}

export default function SeverityBadge({ value, kind = 'severity', size = 'md' }: Props) {
    const v = (value || '').toLowerCase()

    const severityMap: Record<string, string> = {
        critical: 'bg-red-100 text-red-800 border-red-200',
        major: 'bg-orange-100 text-orange-800 border-orange-200',
        minor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        warning: 'bg-amber-100 text-amber-800 border-amber-200',
        info: 'bg-blue-50 text-blue-800 border-blue-100'
    }

    const activityMap: Record<string, string> = {
        create: 'bg-green-100 text-green-800',
        update: 'bg-blue-100 text-blue-800',
        delete: 'bg-red-100 text-red-800',
        provision: 'bg-purple-100 text-purple-800',
        reboot: 'bg-yellow-100 text-yellow-800',
        reset: 'bg-orange-100 text-orange-800',
        login: 'bg-indigo-100 text-indigo-800',
        logout: 'bg-gray-100 text-gray-800'
    }

    const base = kind === 'activity' ? (activityMap[v] || 'bg-gray-100 text-gray-800') : (severityMap[v] || 'bg-gray-100 text-gray-800')

    const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs rounded' : 'px-3 py-1 text-sm rounded'

    return (
        <span className={`${base} ${sizeClass} font-medium`}>
            {value?.toString()?.toUpperCase()}
        </span>
    )
}
