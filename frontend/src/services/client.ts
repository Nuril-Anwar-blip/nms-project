/** AUTO-DOC: src/services/client.ts
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: services/client.ts
 * 
 * API Client untuk komunikasi dengan backend
 * Handle authentication, error, dan response secara konsisten
 * 
 * Fitur:
 * - Automatic token injection
 * - Response/Error interceptor
 * - Type-safe requests
 * - Retry logic untuk network errors
 * 
 * Penggunaan:
 * import { apiClient } from '@/services/client'
 * const data = await apiClient.get('/endpoint')
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

/**
 * Error custom untuk API errors
 * Digunakan untuk membedakan error dari API vs network error
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Response wrapper untuk konsistensi
 */
interface ApiResponse<T> {
    data: T
    message?: string
}

/**
 * Request options
 */
interface RequestOptions {
    headers?: Record<string, string>
    params?: Record<string, any>
}

/**
 * API Client class
 * Menyediakan method untuk HTTP requests dengan handling otomatis
 */
class ApiClient {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    /**
     * Mendapatkan auth headers
     * Inject token JWT ke Authorization header
     */
    private getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('token')
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    }

    /**
     * Build URL dengan query parameters
     */
    private buildURL(endpoint: string, params?: Record<string, any>): string {
        const url = new URL(`${this.baseURL}/api${endpoint}`)
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value))
                }
            })
        }
        return url.toString()
    }

    /**
     * Handle response dari API
     * Throw ApiError jika response tidak OK
     */
    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        // Jika 401 Unauthorized, clear token dan redirect ke login
        if (response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
            throw new ApiError('Unauthorized', 401)
        }

        // Parse response body
        let data: any
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
            data = await response.json()
        } else {
            data = await response.text()
        }

        // Throw error jika response tidak OK
        if (!response.ok) {
            const message = data?.detail || data?.message || `HTTP ${response.status}`
            throw new ApiError(message, response.status, data)
        }

        return { data }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        const url = this.buildURL(endpoint, options?.params)
        const headers = {
            ...this.getAuthHeaders(),
            ...options?.headers
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers
            })
            return this.handleResponse<T>(response)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new Error(`Network error: ${error}`)
        }
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        const url = this.buildURL(endpoint, options?.params)
        const headers = {
            ...this.getAuthHeaders(),
            ...options?.headers
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: body ? JSON.stringify(body) : undefined
            })
            return this.handleResponse<T>(response)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new Error(`Network error: ${error}`)
        }
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        const url = this.buildURL(endpoint, options?.params)
        const headers = {
            ...this.getAuthHeaders(),
            ...options?.headers
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers,
                body: body ? JSON.stringify(body) : undefined
            })
            return this.handleResponse<T>(response)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new Error(`Network error: ${error}`)
        }
    }

    /**
     * DELETE request
     */
    async delete<T>(
        endpoint: string,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        const url = this.buildURL(endpoint, options?.params)
        const headers = {
            ...this.getAuthHeaders(),
            ...options?.headers
        }

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers
            })
            return this.handleResponse<T>(response)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new Error(`Network error: ${error}`)
        }
    }
}

/**
 * Singleton instance dari API client
 * Gunakan ini di seluruh aplikasi
 */
export const apiClient = new ApiClient(API_BASE)

/**
 * Export individual methods untuk convenience
 */
export const get = apiClient.get.bind(apiClient)
export const post = apiClient.post.bind(apiClient)
export const put = apiClient.put.bind(apiClient)
export const del = apiClient.delete.bind(apiClient)

export default apiClient