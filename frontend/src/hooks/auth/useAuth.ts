/** AUTO-DOC: src/hooks/auth/useAuth.ts
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: hooks/auth/useAuth.ts
 * 
 * Hook untuk autentikasi user
 * 
 * Fungsi:
 * - Login user dengan username dan password
 * - Logout user dan membersihkan session
 * - Check status autentikasi user
 * - Menyimpan token JWT di localStorage
 * 
 * Cara penggunaan:
 * const { login, logout, user, loading, error } = useAuth()
 */

import { useState, useEffect } from 'react'
import { login as loginApi, logout as logoutApi } from '../../services/api'
import type { User } from '../../types'

interface UseAuthReturn {
    user: User | null
    loading: boolean
    error: string | null
    login: (username: string, password: string) => Promise<boolean>
    logout: () => void
    isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check if user is already authenticated
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData)
                setUser(parsedUser)
            } catch (e) {
                console.error('Failed to parse user data:', e)
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }

        setLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true)
        setError(null)

        try {
            const response = await loginApi({ email, password })

            if (response && (response as any).access_token && (response as any).user) {
                // store under key 'token' for compatibility with getAuthHeaders
                localStorage.setItem('token', (response as any).access_token)
                localStorage.setItem('user', JSON.stringify((response as any).user))
                setUser((response as any).user)
                return true
            }

            setError('Invalid response from server')
            return false
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed'
            setError(errorMessage)
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        try {
            logoutApi()
        } catch (err) {
            console.error('Logout API error:', err)
        }

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setError(null)
    }

    const isAuthenticated = !!user && !!localStorage.getItem('token')

    return {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated
    }
}
