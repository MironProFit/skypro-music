import { createAsyncThunk } from '@reduxjs/toolkit'
import { TokenPairResponse, ServerErrorResponse } from '../model/types'
import { getTokenApi } from '@api/token/accessTokenApi'

export const getUserToken = createAsyncThunk<
  TokenPairResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/tokenUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Вызываем API
      const response = await getTokenApi(email, password)

      // Проверяем: если есть токены — возвращаем их
      if ('refresh' in response && 'access' in response) {
        return response as TokenPairResponse
      }

      // Если сервер вернул ошибку (например, 400/401)
      // Тип: { detail: string; code: string }
      const errorResponse = response as ServerErrorResponse
      
      // Возвращаем ошибку через rejectWithValue
      return rejectWithValue(`❌ Ошибка авторизации: ${errorResponse.detail}`)
    } catch (error) {
      // Ловим любые другие ошибки (сетевые, таймаут и т.д.)
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      
      console.error('💥 Критическая ошибка:', message)
      return rejectWithValue(`💥 ${message}`)
    }
  }
)