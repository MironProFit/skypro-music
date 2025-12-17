'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FormData } from 'src/sharedTypes/sharedTypes'

// Типы
import { registerUser } from './thunks/registerUser.thunk'
import { loginUser } from './thunks/loginUser.thunk'

// Получение данных из localStorage
export const getStoredUserData = (): UserData => {
  // Проверяем, что код выполняется в браузере
  if (typeof window === 'undefined') {
    return {
      id: undefined,
      email: '',
      username: '',
      tokenAccess: '',
      tokenRefresh: '',
    }
  }

  // Теперь безопасно использовать localStorage
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
      state.userData = initialState.userData
    },
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        if (action.payload.success) {
          const result = action.payload.result
          state.userData = {
            ...state.userData,
            id: result._id,
            email: result.email,
            username: result.username,
          }
        }
        localStorage.setItem('userData', JSON.stringify(state.userData))
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Ошибка регистрации'
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        // Это точно успех
        if ('_id' in action.payload) {
          const result = action.payload
          state.userData = {
            ...state.userData,
            id: result._id,
            email: result.email,
            username: result.email.split('@')[0],
          }
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        // console.log('Rejected action:', action)
        state.loading = false
        state.error =
          action.payload ?? 'Ошибка входа. Проверьте правильность данных'
        // console.log(state.error)
      })
  },
})

export const { setFormData, resetFormData } = authSlice.actions
export default authSlice.reducer
