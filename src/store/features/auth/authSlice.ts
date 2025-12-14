import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FormData } from 'src/sharedTypes/sharedTypes'

// Типы
import { registerUser } from './thunks/registerUser.thunk'

// Получение данных из localStorage
export const getStoredUserData = (): UserData => {
  const data = localStorage.getItem('userData')
  if (data) {
    try {
      const parsed = JSON.parse(data)
      if (parsed.tokenAccess || parsed.tokenRefresh) {
        return parsed
      }
    } catch (e) {
      console.error('Ошибка парсинга userData:', e)
    }
  }
  return {
    id: undefined,
    email: '',
    username: '',
    tokenAccess: '',
    tokenRefresh: '',
  }
}

// Состояние
type UserData = {
  id?: number
  email?: string
  username?: string
  tokenAccess?: string
  tokenRefresh?: string
}

type AuthState = {
  formData: FormData
  userData: UserData
  error: string | null
  loading: boolean
  isLoggedIn: boolean
}

const initialState: AuthState = {
  formData: {
    email: '',
    password: '',
    username: '',
    passwordConfirm: '',
  },
  userData: getStoredUserData(),
  error: null,
  loading: false,
  isLoggedIn:
    !!getStoredUserData().id &&
    (!!getStoredUserData().tokenAccess || !!getStoredUserData().tokenRefresh),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      Object.assign(state.formData, action.payload)
      if (action.payload.email) {
        state.formData.username =
          action.payload.email.split('@')[0].charAt(0).toUpperCase() +
          action.payload.email.split('@')[0].slice(1)
      }
    },
    resetFormData: (state) => {
      state.formData = initialState.formData
      state.error = null
      localStorage.removeItem('userData')
      state.isLoggedIn = false
      state.userData = initialState.userData
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.isLoggedIn = true
        if (action.payload.success) {
          const result = action.payload.result
          state.userData = {
            ...state.userData,
            id: result._id,
            email: result.email,
            username: result.username,
          }
          // ❌ Токены не приходят при регистрации → нужно получать отдельно
          // tokenAccess: ?
          // tokenRefresh: ?
        }
        localStorage.setItem('userData', JSON.stringify(state.userData))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Ошибка регистрации'
      })
  },
})

export const { setFormData, resetFormData } = authSlice.actions
export default authSlice.reducer
