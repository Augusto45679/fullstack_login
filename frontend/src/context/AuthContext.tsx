
"use client"

import axios from "axios"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configuración de axios
axios.defaults.baseURL = "http://localhost:8000/api" // Tu API de Django
axios.defaults.withCredentials = true

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        const response = await axios.get("/auth/me/")
        setUser(response.data)
      }
    } catch (error) {
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login/", {
        email,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
    } catch (error) {
      throw new Error("Error al iniciar sesión")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("/auth/register/", {
        name,
        email,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
    } catch (error) {
      throw new Error("Error al registrarse")
    }
  }

  const loginWithGoogle = async () => {
    try {
      // Aquí implementarías la lógica de Google OAuth
      // Por ahora es una simulación
      const mockUser = {
        id: 1,
        email: "usuario@gmail.com",
        name: "Usuario Google",
      }
      setUser(mockUser)
    } catch (error) {
      throw new Error("Error al iniciar sesión con Google")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginWithGoogle,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
