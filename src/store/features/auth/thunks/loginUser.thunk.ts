import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginUserData, LoginUserResponse } from '../types/loginUser.types'
import { loginApi } from '@api/auth/loginApi'

export const loginUser = createAsyncThunk<
  LoginUserResponse,
  LoginUserData,
  { rejectValue: string }
>('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await loginApi(email, password)
    console.log(`ответ сервера при login:`, data)

    // Проверка, что это успешный ответ (объект с _id)
    if ('_id' in data) {
      // Успешный ответ
      console.log('✅ Успешная авторизация:',  data._id)
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
})
