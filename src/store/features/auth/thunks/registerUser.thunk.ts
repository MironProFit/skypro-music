import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  RegisterUserData,
  RegisterUserResponse,
} from '../types/registerUser.types'
import { registerApi } from 'src/services/api/auth/registerApi'

export const registerUser = createAsyncThunk<
  RegisterUserResponse,
  RegisterUserData,
  { rejectValue: string }
>(
  'auth/registerUser',
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const data = await registerApi(email, password, username)

      if (data.success) {
        console.log('✅ Успешная регистрация:', data)
        return data
      } else {
        console.warn('❌ Ошибка регистрации:', data.message)
        return rejectWithValue(`❌ Ошибка регистрации: ${data.message}`)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      console.error('💥 Критическая ошибка:', message)
      return rejectWithValue(`💥 Критическая ошибка:, ${message}`)
    }
  }
)
