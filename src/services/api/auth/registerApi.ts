import { isAxiosError } from 'axios'
import { RegisterResponse } from '@store/auth'
import { SIGNUP_ENDPOINT } from 'src/config/apiEndpoints'
import { apiClient } from 'src/services/apiClient'

export const registerApi = async (
  email: string,
  password: string,
  username: string,
  signal?: AbortSignal
): Promise<RegisterResponse> => {
  try {
    const res = await apiClient.post<RegisterResponse>(
      SIGNUP_ENDPOINT,
      { email, password, username },
      {
        signal,
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
