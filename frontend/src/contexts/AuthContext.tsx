"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authService } from "../services/authService"
import type { LoginCredentials, RegisterCredentials, User } from "../types/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      authService
        .getCurrentUser()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.login(credentials)
      localStorage.setItem("token", response.token)
      setUser(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.register(credentials)
      localStorage.setItem("token", response.token)
      setUser(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.loginWithGoogle()
      localStorage.setItem("token", response.token)
      setUser(response.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error con Google")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
