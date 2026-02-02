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
} from './model/types'

// --- THUNK'и ---
export { loginUser } from './api/loginThunk'
export { registerUser } from './api/registerThunk'
export { getUserToken } from './api/tokenThunk'

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
