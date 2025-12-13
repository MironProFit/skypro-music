import { createAsyncThunk } from '@reduxjs/toolkit'
import axios, { isAxiosError } from 'axios'
import { API_BASE_URL, POST_SIGNUP_PATH } from 'src/constants'

interface RegisterFormData {
  email: string
  password: string
  username: string
}

interface RegisterResponse {
  token: string
  user: { id: string; email: string; username: string }
}

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterFormData,
  { rejectValue: string }
>(
  'auth/registerUser',
  async ({ email, password, username }, { rejectWithValue, signal }) => {
    try {
      const controller = new AbortController()
      signal.addEventListener('abort', () => controller.abort())

      const res = await axios.post<RegisterResponse>(
        `${API_BASE_URL}${POST_SIGNUP_PATH}`,
        { email, password, username },
        { signal: controller.signal, timeout: 10_000 }
      )

      return res.data
    } catch (error: unknown) {
      if (isAxiosError(error) && error.name === 'AbortError') {
        return rejectWithValue('Запрос отменён')
      }
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message)
      }
      return rejectWithValue('Произошла неожиданная ошибка')
    }
  }
)
