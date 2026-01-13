import { createAsyncThunk } from '@reduxjs/toolkit'

import { loginApi } from '@api/auth/loginApi'
import { LoginRequest, User } from '../index'
import { fetchTracks } from '@store/catalog/api/tracksThunk'
import { fetchAllSelections } from '@store/catalog/api/selectionThunk'

export const loginUser = createAsyncThunk<
  User,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const data = await loginApi(email, password)
      await dispatch(fetchAllSelections())

      // Проверка, что это успешный ответ (объект с _id)
      if ('_id' in data) {
        // Успешный ответ
        console.log('✅ Успешная авторизация:', data._id)
        await dispatch(fetchTracks())

        return data
      } else {
        // Обработка ошибки, если success отсутствует или false
        const message = data?.message || 'Ошибка авторизации'
        console.warn('❌ Ошибка авторизации:', message)
        return rejectWithValue(`❌ Ошибка авторизации: ${message}`)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      console.error('💥 Критическая ошибка:', message)
      return rejectWithValue(`💥 Критическая ошибка: ${message}`)
    }
  }
)
