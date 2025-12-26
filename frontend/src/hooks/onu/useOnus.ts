/**
 * File: hooks/onu/useOnus.ts
 * 
 * Hook untuk mengelola data ONU
 * 
 * Fungsi:
 * - Fetch daftar ONU dari API
 * - Fetch ONU per OLT
 * - Menyimpan state ONU
 * - Menyediakan loading state
 * - Error handling
 * 
 * Cara penggunaan:
 * const { onus, loading, error, refreshOnus, getOnusByOlt } = useOnus()
 */

import { useState, useEffect } from 'react'
import { getOnus, getOltOnus } from '../../services/api'
import type { Onu } from '../../types'

interface UseOnusReturn {
    onus: Onu[]
    loading: boolean
    error: string | null
    refreshOnus: () => Promise<void>
    getOnusByOlt: (oltId: number) => Promise<Onu[]>
}

export function useOnus(): UseOnusReturn {
    const [onus, setOnus] = useState<Onu[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOnus = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await getOnus()
            setOnus(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ONUs'
            setError(errorMessage)
            console.error('Failed to fetch ONUs:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchOnusByOlt = async (oltId: number): Promise<Onu[]> => {
        try {
            const data = await getOltOnus(oltId)
            return data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ONUs for OLT'
            setError(errorMessage)
            console.error('Failed to fetch ONUs for OLT:', err)
            return []
        }
    }

    const refreshOnus = async () => {
        await fetchOnus()
    }

    useEffect(() => {
        fetchOnus()
    }, [])

    return {
        onus,
        loading,
        error,
        refreshOnus,
        getOnusByOlt: fetchOnusByOlt
    }
}