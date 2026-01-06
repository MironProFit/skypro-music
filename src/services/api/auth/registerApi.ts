import axios, { isAxiosError } from 'axios'
import { BASE_API_URL, SIGNUP_ENDPOINT } from 'src/constants'
import { RegisterUserResponse } from '@store/auth/model/registerUser.types'

export const registerApi = async (
  email: string,
  password: string,
  username: string,
  signal?: AbortSignal
): Promise<RegisterUserResponse> => {
  try {
    const res = await axios.post<RegisterUserResponse>(
      `${BASE_API_URL}${SIGNUP_ENDPOINT}`,
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
