import { TokenResponse } from '@store/auth'
import axios, { isAxiosError } from 'axios'
import { TOKEN_ENDPOINT } from 'src/config/apiEndpoints'

import { apiClient } from 'src/services/apiClient'

export const getTokenApi = async (
  email: string,
  password: string,
  signal?: AbortSignal
): Promise<TokenResponse> => {
  try {
    const res = await apiClient.post<TokenResponse>(
      TOKEN_ENDPOINT,
      { email, password },
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
