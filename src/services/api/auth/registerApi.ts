import axios, { isAxiosError } from 'axios'
import { API_BASE_URL, POST_SIGNUP_PATH } from 'src/constants'
import { RegisterUserResponse } from 'src/store/features/auth/types/registerUser.types'

export const registerApi = async (
  email: string,
  password: string,
  username: string,
  signal?: AbortSignal
): Promise<RegisterUserResponse> => {
  try {
    const res = await axios.post<RegisterUserResponse>(
      `${API_BASE_URL}${POST_SIGNUP_PATH}`,
      { email, password, username },
      {
        signal,
        timeout: 10_000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return res.data
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      // Сервер прислал 4xx, 5xx
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      }
    }
    // Ошибка сети, например
    return {
      success: false,
      message: 'Произошла неожиданная ошибка',
    }
  }
}
