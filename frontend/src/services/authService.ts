import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "../types/auth"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/"

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("token/", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("register/", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  // async loginWithGoogle(): Promise<AuthResponse> {
  //   // This would typically redirect to Google OAuth or open a popup
  //   // For now, we'll simulate the flow
  //   window.location.href = `${API_BASE_URL}/auth/google`
  //   return Promise.reject(new Error("Redirecting to Google..."))
  // }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("authenticated/me")
  }

  async logout(): Promise<void> {
    return this.request<void>("logout/", {
      method: "POST",
    })
  }
}

export const authService = new AuthService()
