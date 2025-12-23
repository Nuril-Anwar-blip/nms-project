/**
 * File: hooks/useOnus.ts
 * 
 * Custom hook untuk manajemen data ONU
 * 
 * Fungsi:
 * - Mengelola state daftar ONU
 * - Fetch data ONU dari API dengan filter
 * - CRUD operations untuk ONU
 * - Auto-refresh data secara berkala
 * 
 * Return:
 * - onus: Array ONU
 * - loading: Boolean loading state
 * - error: Error message jika ada
 * - fetchOnus: Function untuk fetch data dengan filter
 * - createOnu: Function untuk create ONU baru
 * - updateOnu: Function untuk update ONU
 * - deleteOnu: Function untuk delete ONU
 * 
 * Usage:
 * const { onus, loading, fetchOnus } = useOnus()
 * fetchOnus({ olt_id: 1, status: 'online' })
 */

import { useState, useCallback } from 'react'
import { getOnus, createOnu, updateOnu, deleteOnu } from '../services/api'
import type { Onu, OnuCreate } from '../types'

export function useOnus() {
  const [onus, setOnus] = useState<Onu[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch daftar ONU dari API dengan filter opsional
   */
  const fetchOnus = useCallback(async (filters?: {
    olt_id?: number
    status?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOnus(filters)
      setOnus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ONUs')
      console.error('Failed to fetch ONUs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create ONU baru
   */
  const createOnuHandler = async (onuData: OnuCreate): Promise<Onu> => {
    try {
      const newOnu = await createOnu(onuData)
      setOnus([...onus, newOnu])
      return newOnu
    } catch (err) {
      throw err
    }
  }

  /**
   * Update ONU
   */
  const updateOnuHandler = async (id: number, onuData: Partial<OnuCreate>): Promise<Onu> => {
    try {
      const updatedOnu = await updateOnu(id, onuData)
      setOnus(onus.map(onu => onu.id === id ? updatedOnu : onu))
      return updatedOnu
    } catch (err) {
      throw err
    }
  }

  /**
   * Delete ONU
   */
  const deleteOnuHandler = async (id: number): Promise<void> => {
    try {
      await deleteOnu(id)
      setOnus(onus.filter(onu => onu.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    onus,
    loading,
    error,
    fetchOnus,
    createOnu: createOnuHandler,
    updateOnu: updateOnuHandler,
    deleteOnu: deleteOnuHandler
  }
}

