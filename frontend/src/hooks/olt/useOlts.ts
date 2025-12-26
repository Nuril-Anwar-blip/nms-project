/**
 * File: hooks/olt/useOlts.ts
 * 
 * Hook untuk mengelola data OLT
 * 
 * Fungsi:
 * - Fetch daftar OLT dari API
 * - Menyimpan state OLT
 * - Menyediakan loading state
 * - Error handling
 * 
 * Cara penggunaan:
 * const { olts, loading, error, refreshOlts } = useOlts()
 */

import { useState, useEffect } from 'react'
import { getOlts } from '../../services/api'
import type { Olt } from '../../types'

interface UseOltsReturn {
    olts: Olt[]
    loading: boolean
    error: string | null
    refreshOlts: () => Promise<void>
}

export function useOlts(): UseOltsReturn {
    const [olts, setOlts] = useState<Olt[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOlts = async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await getOlts()
            setOlts(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch OLTs'
            setError(errorMessage)
            console.error('Failed to fetch OLTs:', err)
        } finally {
            setLoading(false)
        }
    }

    const refreshOlts = async () => {
        await fetchOlts()
    }

    useEffect(() => {
        fetchOlts()
    }, [])

    return {
        olts,
        loading,
        error,
        refreshOlts
    }
}