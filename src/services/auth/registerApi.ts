import { createAsyncThunk } from '@reduxjs/toolkit'
import axios, { isAxiosError } from 'axios'
import { API_BASE_URL, POST_SIGNUP_PATH } from 'src/constants'

// Данные, которые отправляем на сервер
export interface RegisterFormData {
  email: string
  password: string
  username: string
}

// Успешный ответ от сервера
interface RegisterSuccessResponse {
  message: string
  result: {
    _id: number
    email: string
    username: string
  }
  success: true
}

// Ошибка от сервера
interface RegisterErrorResponse {
  message: string
  success: false
}

// Общий тип ответа
type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse

/**
 * Асинхронный экшен для регистрации пользователя
 */
export const registerUser = createAsyncThunk<
  RegisterSuccessResponse, // Возвращаем только успешный ответ
  RegisterFormData,
  { rejectValue: string }
>(
  'auth/registerUser',
  async ({ email, password, username }, { rejectWithValue, signal }) => {
    try {
      // Для отмены запроса (например, при уходе со страницы)
      const controller = new AbortController()
      signal.addEventListener('abort', () => controller.abort())

      // Отправка POST-запроса
      const res = await axios.post<RegisterResponse>(
        'https://webdev-music-003b5b991590.herokuapp.com/user/signup/',
        { email, password, username },
        {
          signal: controller.signal,
          timeout: 10_000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      // ✅ Проверяем, успешна ли регистрация
      if (res.data.success) {
        return res.data // попадёт в `fulfilled`
      } else {
        // Сервер вернул success: false
        return rejectWithValue(res.data.message || 'Ошибка регистрации')
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.name === 'AbortError') {
        console.log('🔁 Запрос отменён')
        return rejectWithValue('Запрос отменён')
      }

      // 2. Ошибка от сервера (400, 409, 500 и т.д.)
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || error.message
        return rejectWithValue(`❌ Ошибка от сервера: ${message}`)
      }

      // 3. Неизвестная ошибка (не от axios)
      return rejectWithValue('Произошла неожиданная ошибка')
    }
  }
)
