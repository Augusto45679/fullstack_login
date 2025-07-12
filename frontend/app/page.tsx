"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"
import Dashboard from "@/components/dashboard"

export default function App() {
  const [currentView, setCurrentView] = useState<"login" | "register" | "dashboard">("login")
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  const handleLogin = (email: string, name?: string) => {
    setUser({ email, name: name || email.split("@")[0] })
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("login")
  }

  const handleGoogleLogin = () => {
    // Simulamos login con Google
    const googleUser = {
      email: "usuario@gmail.com",
      name: "Usuario Google",
    }
    handleLogin(googleUser.email, googleUser.name)
  }

  if (currentView === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {currentView === "login" ? (
          <LoginForm
            onLogin={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onSwitchToRegister={() => setCurrentView("register")}
          />
        ) : (
          <RegisterForm
            onRegister={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onSwitchToLogin={() => setCurrentView("login")}
          />
        )}
      </div>
    </div>
  )
}
