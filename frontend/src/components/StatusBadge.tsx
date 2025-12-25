/**
 * File: components/StatusBadge.tsx
 *
 * Komponen `StatusBadge` digunakan untuk menampilkan status perangkat
 * (online, offline, warning, critical) secara konsisten di seluruh UI.
 *
 * Alasan desain:
 * - Menggunakan warna dan label yang mudah dibedakan namun tidak menyakitkan mata.
 * - Ukuran dan padding disesuaikan untuk penggunaan di tabel, kartu, atau header.
 * - Menyediakan `aria-label` untuk aksesibilitas dan konsistensi suara pembaca layar.
 *
 * Cara penggunaan:
 * <StatusBadge status="online" />
 * <StatusBadge status="offline" size="sm" />
 *
 * Props:
 * - status: 'online' | 'offline' | 'warning' | 'critical' | string
 * - size: 'sm' | 'md' (opsional, default 'md')
 */



interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const normalized = (status || '').toLowerCase()

    // Mapping visual berdasarkan status
    const map: Record<string, { bg: string; text: string; label: string }> = {
        online: { bg: 'bg-green-100', text: 'text-green-800', label: 'Online' },
        offline: { bg: 'bg-red-100', text: 'text-red-800', label: 'Offline' },
        warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Warning' },
        critical: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Critical' },
        // Common alarm / workflow statuses
        active: { bg: 'bg-red-100', text: 'text-red-800', label: 'Active' },
        acknowledged: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Acknowledged' },
        cleared: { bg: 'bg-green-100', text: 'text-green-800', label: 'Cleared' },
        unknown: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' }
    }

    const style = map[normalized] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status || '-' }

    const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs rounded-full' : 'px-3 py-1 text-sm rounded-full'

    return (
        <span
            className={`${style.bg} ${style.text} ${sizeClass} font-medium`}
            aria-label={`status-${normalized}`}
            title={style.label}
        >
            {style.label}
        </span>
    )
}
