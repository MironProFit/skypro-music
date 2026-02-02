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
export type LoginResponse = User // Успешный ответ — это сам пользователь

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

// --- ОТВЕТЫ ОТ СЕРВЕРА (ОШИБКИ) ---
export interface ServerErrorResponse {
  detail: string
  code: string
}

// --- ОТВЕТЫ НА ПОЛУЧЕНИЕ ТОКЕНОВ (/user/token/) ---
export interface TokenPairResponse {
  refresh: string
  access: string
}

export type TokenResponse = TokenPairResponse | ServerErrorResponse

// --- ОТВЕТЫ НА ОБНОВЛЕНИЕ ТОКЕНА (/user/token/refresh/) ---
export interface RefreshTokenResponse {
  access: string
}

export type RefreshTokenResult = RefreshTokenResponse | ServerErrorResponse

// --- ФОРМА АВТОРИЗАЦИИ ---
export type AuthFormData = {
  email: string
  password: string
  username?: string
  passwordConfirm?: string
}