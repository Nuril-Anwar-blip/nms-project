/**
 * File: hooks/useAuth.ts
 * 
 * Custom hook untuk manajemen autentikasi user
 * 
 * Fungsi:
 * - Mengelola state user yang sedang login
 * - Memeriksa apakah user sudah terautentikasi
 * - Menyediakan fungsi login dan logout
 * - Memuat user data dari localStorage saat aplikasi dimuat
 * 
 * Return:
 * - user: User object atau null jika belum login
 * - isAuthenticated: Boolean apakah user sudah login
 * - login: Function untuk login
 * - logout: Function untuk logout
 * 
 * Usage:
 * const { user, isAuthenticated, login, logout } = useAuth()
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/api'
import type { User, LoginRequest } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Load user data dari localStorage saat aplikasi dimuat
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        // Verify token dengan mengambil user data dari API
        getCurrentUser()
          .then((currentUser) => {
            setUser(currentUser)
            localStorage.setItem('user', JSON.stringify(currentUser))
          })
          .catch(() => {
            // Token invalid, clear storage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
          })
          .finally(() => setLoading(false))
      } catch (error) {
        console.error('Failed to parse user data:', error)
        setUser(null)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  /**
   * Login function
   * Mengirim request ke API dan menyimpan token/user data
   */
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiLogin(credentials)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout function
   * Memanggil API logout dan membersihkan storage
   */
  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  }
}

