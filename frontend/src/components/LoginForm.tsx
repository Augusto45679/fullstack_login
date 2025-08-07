"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import type { LoginCredentials } from "../types/auth"
import "./AuthForms.css"

const LoginForm: React.FC = () => {
  const { login, error, loading } = useAuth()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<LoginCredentials>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof LoginCredentials]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {}

    if (!formData.email) {
      errors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El email no es válido"
    }

    if (!formData.password) {
      errors.password = "La contraseña es requerida"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await login(formData)
    } catch (err) {
      // El error se maneja en el contexto
    }
  }

  const GOOGLE_LOGIN_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}auth/google/login`
    : "http://127.0.0.1:8000/api/auth/google/login"

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Bienvenido</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? "error" : ""}
              placeholder="Ingresa tu email"
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? "error" : ""}
              placeholder="Ingresa tu contraseña"
            />
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button primary" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <button
          type="button"
          className="google-login-btn"
          onClick={() => window.location.assign(GOOGLE_LOGIN_URL)}
        >
          Iniciar sesión con Google
        </button>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="auth-link">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
