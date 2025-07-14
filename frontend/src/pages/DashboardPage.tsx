"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Panel de Control</h1>
        <div className="user-info">
          <span>Bienvenido, {user?.name}!</span>
          <button onClick={logout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h2>Información del Usuario</h2>
          <p>
            <strong>Nombre:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Proveedor:</strong> {user?.provider || "local"}
          </p>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
