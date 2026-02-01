import { apiClient } from 'src/services/apiClient'

import { TOKEN_ENDPOINT } from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'
import { ServerErrorResponse, TokenPairResponse } from '@store/auth/model/types'

export const getTokenApi = async (
  email: string,
  password: string
): Promise<TokenPairResponse> => {
  try {
    const response = await apiClient.post<TokenPairResponse | ServerErrorResponse>(
      TOKEN_ENDPOINT,
      { email, password }
    )

    if ('refresh' in response.data && 'access' in response.data) {
      return response.data as TokenPairResponse
    }

    const errorResponse = response.data as ServerErrorResponse
    throw new Error(errorResponse.detail)
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data as ServerErrorResponse
      throw new Error(errorData.detail || 'Ошибка получения токена')
    }
    throw new Error('Неизвестная ошибка сети')
  }
}