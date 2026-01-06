import { createAsyncThunk } from '@reduxjs/toolkit'
import { TokenSuccessResponse, TokenResponse } from '../model/auth'
import { getTokenApi } from '@api/token/tokenApi'
import { RootState } from 'src/store/store'

export const getUserToken = createAsyncThunk<
  TokenResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/tokenUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await getTokenApi(email, password)

      if ('refresh' in response && 'access' in response) {
        return response as TokenSuccessResponse
      } else {
        return rejectWithValue(`❌ Ошибка регистрации: ${response.message}`)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      console.error('💥 Критическая ошибка:', message)
      return rejectWithValue(`💥 Критическая ошибка: ${message}`)
    }
  },
  {
    condition: (args, { getState }) => {
      const state = getState() as RootState
      const { tokenAccess, tokenRefresh } = state.auth.userData

      // Проверяем, есть ли уже токены
      if (tokenAccess || tokenRefresh) {
        console.log('Токены уже есть, выполнение пропущено')
        return false
      }

      // Проверка наличия email и password в args
      if (!args.email || !args.password) {
        console.log('Отсутствуют email или password, выполнение пропущено')
        return false
      }

      // Всё в порядке — запускать
      return true
    },
  }
)
