/** AUTO-DOC: src/services/olt/oltService.ts
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: services/olt/index.ts
 * 
 * Service layer untuk OLT management
 * Memisahkan logika API dari komponen UI agar mudah ditest dan diganti
 * 
 * Struktur:
 * - Semua endpoint OLT berada di satu file
 * - Error handling konsisten
 * - Type safety dengan TypeScript
 * - Token management otomatis
 * 
 * Penggunaan:
 * import { oltService } from '@/services/olt'
 * const olts = await oltService.getAll()
 */

import { apiClient } from '../client'
import type { Olt, OltCreate, ApiResponse } from '@/types'

/**
 * OLT Service
 * Menyediakan fungsi-fungsi untuk berinteraksi dengan OLT API
 */
export const oltService = {
    /**
     * Mendapatkan semua OLT
     * GET /api/olts
     */
    async getAll(): Promise<Olt[]> {
        const response = await apiClient.get<Olt[]>('/olts')
        return response.data
    },

    /**
     * Mendapatkan OLT berdasarkan ID
     * GET /api/olts/:id
     */
    async getById(id: number): Promise<Olt> {
        const response = await apiClient.get<Olt>(`/olts/${id}`)
        return response.data
    },

    /**
     * Membuat OLT baru
     * POST /api/olts
     * 
     * @param data - Data OLT yang akan dibuat
     * @returns OLT yang telah dibuat beserta ID dari database
     */
    async create(data: OltCreate): Promise<Olt> {
        const response = await apiClient.post<Olt>('/olts', data)
        return response.data
    },

    /**
     * Update OLT
     * PUT /api/olts/:id
     * 
     * @param id - ID OLT yang akan diupdate
     * @param data - Data OLT yang akan diupdate (partial)
     */
    async update(id: number, data: Partial<OltCreate>): Promise<Olt> {
        const response = await apiClient.put<Olt>(`/olts/${id}`, data)
        return response.data
    },

    /**
     * Hapus OLT
     * DELETE /api/olts/:id
     * 
     * @param id - ID OLT yang akan dihapus
     * 
     * Catatan: Menghapus OLT akan menghapus semua ONU yang terkait
     * Pastikan user sudah konfirmasi sebelum memanggil fungsi ini
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/olts/${id}`)
    },

    /**
     * Poll OLT untuk mendapatkan data terbaru via SNMP
     * POST /api/monitoring/olt/:id/poll
     * 
     * @param id - ID OLT yang akan di-poll
     * @returns Data polling (status, CPU, memory, temperature)
     * 
     * Fungsi ini memicu polling SNMP ke perangkat OLT untuk:
     * - Status operasional (up/down)
     * - CPU usage
     * - Memory usage  
     * - Temperature
     * - Uptime
     */
    async poll(id: number): Promise<ApiResponse<Olt>> {
        const response = await apiClient.post<ApiResponse<Olt>>(
            `/monitoring/olt/${id}/poll`
        )
        return response.data
    },

    /**
     * Sync ONU dari OLT ke database
     * POST /api/monitoring/olt/:id/sync-onus
     * 
     * @param id - ID OLT yang akan di-sync
     * @returns Jumlah ONU yang di-sync (created, updated)
     * 
     * Fungsi ini membaca daftar ONU dari OLT via SNMP/CLI
     * kemudian menyinkronkan ke database lokal
     */
    async syncOnus(id: number): Promise<{
        synced: number
        created: number
        updated: number
    }> {
        const response = await apiClient.post<{
            synced: number
            created: number
            updated: number
        }>(`/monitoring/olt/${id}/sync-onus`)
        return response.data
    },

    /**
     * Mendapatkan daftar ONU dari OLT tertentu
     * GET /api/monitoring/olt/:id/onus
     * 
     * @param id - ID OLT
     * @param status - Filter status ONU (optional)
     */
    async getOnus(id: number, status?: string): Promise<any[]> {
        const params = status ? { status } : {}
        const response = await apiClient.get<any[]>(
            `/monitoring/olt/${id}/onus`,
            { params }
        )
        return response.data
    }
}

// Export default untuk kemudahan import
export default oltService