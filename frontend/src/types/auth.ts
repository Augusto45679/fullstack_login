export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider?: "local" | "google"
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  status: number
}
