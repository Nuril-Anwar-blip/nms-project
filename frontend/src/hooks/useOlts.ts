/** AUTO-DOC: src/hooks/useOlts.ts
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: hooks/useOlts.ts
 * 
 * Custom hook untuk manajemen data OLT
 * 
 * Fungsi:
 * - Mengelola state daftar OLT
 * - Fetch data OLT dari API
 * - CRUD operations untuk OLT
 * - Auto-refresh data secara berkala
 * 
 * Return:
 * - olts: Array OLT
 * - loading: Boolean loading state
 * - error: Error message jika ada
 * - fetchOlts: Function untuk fetch data
 * - createOlt: Function untuk create OLT baru
 * - updateOlt: Function untuk update OLT
 * - deleteOlt: Function untuk delete OLT
 * 
 * Usage:
 * const { olts, loading, fetchOlts, createOlt } = useOlts()
 */

import { useState, useEffect, useCallback } from 'react'
import { getOlts, createOlt, updateOlt, deleteOlt } from '../services/api'
import type { Olt, OltCreate } from '../types'

export function useOlts(autoRefresh: boolean = false, refreshInterval: number = 30000) {
  const [olts, setOlts] = useState<Olt[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch daftar OLT dari API
   */
  const fetchOlts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOlts()
      setOlts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch OLTs')
      console.error('Failed to fetch OLTs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create OLT baru
   */
  const createOltHandler = async (oltData: OltCreate): Promise<Olt> => {
    try {
      const newOlt = await createOlt(oltData)
      setOlts([...olts, newOlt])
      return newOlt
    } catch (err) {
      throw err
    }
  }

  /**
   * Update OLT
   */
  const updateOltHandler = async (id: number, oltData: Partial<OltCreate>): Promise<Olt> => {
    try {
      const updatedOlt = await updateOlt(id, oltData)
      setOlts(olts.map(olt => olt.id === id ? updatedOlt : olt))
      return updatedOlt
    } catch (err) {
      throw err
    }
  }

  /**
   * Delete OLT
   */
  const deleteOltHandler = async (id: number): Promise<void> => {
    try {
      await deleteOlt(id)
      setOlts(olts.filter(olt => olt.id !== id))
    } catch (err) {
      throw err
    }
  }

  // Auto-refresh jika enabled
  useEffect(() => {
    fetchOlts()
    
    if (autoRefresh) {
      const interval = setInterval(fetchOlts, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchOlts, autoRefresh, refreshInterval])

  return {
    olts,
    loading,
    error,
    fetchOlts,
    createOlt: createOltHandler,
    updateOlt: updateOltHandler,
    deleteOlt: deleteOltHandler
  }
}

