// src/store/auth/slice/authSlice.ts
'use client'

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { registerUser } from '../api/registerThunk'
import { loginUser } from '../api/loginThunk'
import { getUserToken } from '../api/tokenThunk'
import { AuthFormData } from '../model/types'

export type UserData = {
  id?: number
  email?: string
  username?: string
  tokenAccess?: string | null
  tokenRefresh?: string | null
}

type AuthState = {
  formData: AuthFormData
  userData: UserData
  error: string | null
  isDataLoading: boolean
  isLoadingTrackList: boolean
  isLoggedIn: boolean
}

// === УДАЛЕНО: getStoredUserData() ===
// === УДАЛЕНО: getInitialUserData() ===

// Новое начальное состояние
const initialState: AuthState = {
  formData: {
    email: '',
    password: '',
    username: '',
    passwordConfirm: '',
  },
  userData: {
    id: undefined,
    email: '',
    username: '',
    tokenAccess: null,
    tokenRefresh: null,
  },
  error: null,
  isDataLoading: false,
  isLoadingTrackList: false,
  isLoggedIn: false, // По умолчанию пользователь не залогинен
}

const getNameUserFromEmail = (email: string): string => {
  return (
    email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
  )
}

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
      state.formData = { ...initialState.formData }
      state.error = null
    },

    setIsLoadingTrackList: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTrackList = action.payload
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.userData.tokenAccess = action.payload
    },

    clearError: (state) => {
      state.error = null
    },

    logoutUser: (state) => {
      // === УДАЛЕНО: localStorage.removeItem('userData') ===
      // Просто сбрасываем состояние в Redux
      state.formData = { ...initialState.formData }
      state.userData = { ...initialState.userData }
      state.isLoggedIn = false
      state.error = null
      state.isDataLoading = false
      state.isLoadingTrackList = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isDataLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isDataLoading = false
        state.error = null
        if (action.payload.success && '_id' in action.payload.result) {
          const result = action.payload.result
          state.userData = {
            ...state.userData,
            id: result._id,
            email: result.email,
            username: getNameUserFromEmail(result.email),
          }
          // === УДАЛЕНО: localStorage.setItem('userData', ...) ===
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isDataLoading = false
        state.error = action.payload ?? 'Ошибка регистрации'
      })

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

      .addCase(getUserToken.fulfilled, (state, action) => {
        state.isDataLoading = false
        if ('access' in action.payload && 'refresh' in action.payload) {
          const { access, refresh } = action.payload
          state.userData.tokenAccess = access
          state.userData.tokenRefresh = refresh
          state.isLoggedIn = true
          // === УДАЛЕНО: localStorage.setItem('userData', ...) ===
        }
      })
      .addCase(getUserToken.rejected, (state, action) => {
        state.isDataLoading = false
        state.error = action.payload ?? 'Ошибка получения токенов'
        state.isLoggedIn = false
        state.userData = { ...initialState.userData }
        // === УДАЛЕНО: localStorage.removeItem('userData') ===
      })
  },
})

export const authSliceReducer = authSlice.reducer // Исправлена опечатка в названии

export const {
  setFormData,
  resetFormData,
  setIsLoadingTrackList,
  setAccessToken,
  clearError,
  logoutUser,
} = authSlice.actions

// ... остальные селекторы остаются без изменений ...
export const selectAuthFormData = (state: { auth: AuthState }) =>
  state.auth.formData
export const selectAuthUser = (state: { auth: AuthState }) =>
  state.auth.userData
export const selectAuthIsLoading = (state: { auth: AuthState }) =>
  state.auth.isDataLoading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export const selectIsLoggedIn = (state: { auth: AuthState }) =>
  state.auth.isLoggedIn

export const selectAuthTokens = createSelector(
  (state: { auth: { userData: UserData } }) => state.auth.userData.tokenAccess,
  (state: { auth: { userData: UserData } }) => state.auth.userData.tokenRefresh,
  (tokenAccess, tokenRefresh) => ({
    tokenAccess: tokenAccess || null,
    tokenRefresh: tokenRefresh || null,
  }),
)