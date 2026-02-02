'use client'

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { registerUser } from '../api/registerThunk'
import { loginUser } from '../api/loginThunk'
import { getUserToken } from '../api/tokenThunk'
import { AuthFormData } from '../model/types'

// === Получение данных из localStorage ===
export const getStoredUserData = (): UserData => {
  if (typeof window === 'undefined') {
    return {
      id: undefined,
      email: '',
      username: '',
      tokenAccess: '',
      tokenRefresh: '',
    }
  }

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

// === Типы ===
type UserData = {
  id?: number
  email?: string
  username?: string
  tokenAccess?: string
  tokenRefresh?: string
}

type AuthState = {
  formData: AuthFormData
  userData: UserData
  error: string | null
  isDataLoading: boolean
  isLoadingTrackList: boolean
  isLoggedIn: boolean
}

// === Начальное состояние ===
const initialState: AuthState = {
  formData: {
    email: '',
    password: '',
    username: '',
    passwordConfirm: '',
  },
  userData: getStoredUserData(),
  error: null,
  isDataLoading: false,
  isLoadingTrackList: false,
  isLoggedIn: !!getStoredUserData().id && !!getStoredUserData().tokenRefresh,
}

// === Вспомогательная функция ===
const getNameUserFromEmail = (email: string): string => {
  return (
    email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
  )
}

// === Slice ===
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Partial<AuthFormData>>) => {
      Object.assign(state.formData, action.payload)
      if (action.payload.email) {
        state.formData.username = getNameUserFromEmail(action.payload.email)
      }
    },
    resetFormData: (state) => {
      state.formData = initialState.formData
      state.error = null
      localStorage.removeItem('userData')
      state.userData = {
        id: undefined,
        email: '',
        username: '',
        tokenAccess: '',
        tokenRefresh: '',
      }
      state.isLoggedIn = false
    },
    setIsLoadingTrackList: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTrackList = action.payload
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.userData.tokenAccess = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isDataLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isDataLoading = false
        state.error = null
        if (action.payload.success) {
          const result = action.payload.result
          state.userData = {
            ...state.userData,
            id: result._id,
            email: result.email,
            username: getNameUserFromEmail(result.email),
          }
          localStorage.setItem('userData', JSON.stringify(state.userData))
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isDataLoading = false
        state.error = action.payload ?? 'Ошибка регистрации'
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isDataLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isDataLoading = false
        state.error = null
        if ('_id' in action.payload) {
          const result = action.payload
          state.userData = {
            ...state.userData,
            id: result._id,
            email: result.email,
            username: getNameUserFromEmail(result.email),
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isDataLoading = false
        state.error =
          action.payload ?? 'Ошибка входа. Проверьте правильность данных'
      })

      // getUserToken
      .addCase(getUserToken.pending, (state) => {
        state.isDataLoading = true
        state.error = null
      })
      .addCase(getUserToken.fulfilled, (state, action) => {
        state.isDataLoading = false
        if ('refresh' in action.payload) {
          const { access, refresh } = action.payload
          state.userData.tokenAccess = access
          state.userData.tokenRefresh = refresh
          state.isLoggedIn = true
          localStorage.setItem('userData', JSON.stringify(state.userData))
        }
      })
      .addCase(getUserToken.rejected, (state, action) => {
        state.isDataLoading = false
        if (action.payload) {
          state.error = action.payload
        }
      })
  },
})

export const {
  setFormData,
  resetFormData,
  setIsLoadingTrackList,
  setAccessToken,
} = authSlice.actions
export const authSliceSliceReducer = authSlice.reducer

// === СЕЛЕКТОРЫ ===
import { RootState } from 'src/store/store'

export const selectAuthFormData = (state: RootState) => state.auth.formData
export const selectAuthUser = (state: RootState) => state.auth.userData
export const selectAuthIsLoading = (state: RootState) =>
  state.auth.isDataLoading
export const selectAuthError = (state: RootState) => state.auth.error
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn

export const selectAuthTokens = createSelector(
  (state: RootState) => state.auth.userData.tokenAccess,
  (state: RootState) => state.auth.userData.tokenRefresh,
  (tokenAccess, tokenRefresh) => ({
    tokenAccess,
    tokenRefresh,
  }),
)
