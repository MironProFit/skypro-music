import { TokenUserResponse } from '@store/auth/model/tokenUser.types'
import axios, { isAxiosError } from 'axios'
import { BASE_API_URL, TOKEN_ENDPOINT } from 'src/constants'

export const getTokenApi = async (
  email: string,
  password: string,
  signal?: AbortSignal
): Promise<TokenUserResponse> => {
  try {
    const res = await axios.post<TokenUserResponse>(
      `${BASE_API_URL}${TOKEN_ENDPOINT}`,
      { email, password },
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
