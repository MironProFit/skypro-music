// --- ЗАПРОСЫ ---
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
}

export interface TokenRequest {
  email: string
  password: string
}

// --- ОБЩИЙ ТИП ПОЛЬЗОВАТЕЛЯ ---
export interface User {
  _id: number
  email: string
  username: string
}

// --- ОТВЕТЫ НА ЛОГИН ---
export interface LoginErrorResponse {
  success: false
  message: string
}
export type LoginResponse = User | LoginErrorResponse

// --- ОТВЕТЫ НА РЕГИСТРАЦИЮ ---
export interface RegisterSuccessResponse {
  success: true
  message: string
  result: User
}
export interface RegisterErrorResponse {
  success: false
  message: string
}
export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse

// --- ОТВЕТЫ НА ТОКЕН ---
export interface TokenSuccessResponse {
  refresh: string
  access: string
}
export interface TokenErrorResponse {
  success: false
  message: string
}
export type TokenResponse = TokenSuccessResponse | TokenErrorResponse

export type AuthFormData = {
  email: string
  password: string
  username?: string
  passwordConfirm?: string
}
