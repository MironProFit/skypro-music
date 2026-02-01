import { apiClient } from 'src/services/apiClient'
import { REFRESH_TOKEN_ENDPOINT } from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'
import {
  RefreshTokenResponse,
  ServerErrorResponse,
} from '@store/auth/model/types'

export const refreshTokenApi = async (
  refresh: string,
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<
      RefreshTokenResponse | ServerErrorResponse
    >(REFRESH_TOKEN_ENDPOINT, { refresh })

    if ('access' in response.data) {
      return response.data as RefreshTokenResponse
    }

    const errorResponse = response.data as ServerErrorResponse
    throw new Error(errorResponse.detail)
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data as ServerErrorResponse
      throw new Error(errorData.detail || 'Ошибка обновления токена')
    }
    throw new Error('Неизвестная ошибка сети')
  }
}
