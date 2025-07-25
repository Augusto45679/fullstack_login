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
  access: string;  // Cambiado de 'token' a 'access'
  refresh: string;
}

export interface ApiError {
  message: string
  status: number
}
