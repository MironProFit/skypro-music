// --- ТИПЫ ---
export type {
  // Запросы
  LoginRequest,
  RegisterRequest,
  TokenRequest,
  // Пользователь
  User,
  AuthFormData,
  // Ответы
  LoginResponse,
  LoginErrorResponse,
  RegisterResponse,
  RegisterSuccessResponse,
  RegisterErrorResponse,
  TokenResponse,
  TokenSuccessResponse,
  TokenErrorResponse,
} from './model/auth'

// --- THUNK'и ---
export { loginUser } from './api/login'
export { registerUser } from './api/register'
export { getUserToken } from './api/token'

// --- ACTIONS ---

export {
  setFormData,
  resetFormData,
  setIsLoadingTrackList,
} from './slices/authSlice'

// --- СОСТОЯНИЕ ---
export { selectAuthFormData } from './slices/authSlice'
export {
  selectAuthUser,
  selectAuthIsLoading,
  selectAuthError,
  selectAuthTokens,
} from './slices/authSlice'
