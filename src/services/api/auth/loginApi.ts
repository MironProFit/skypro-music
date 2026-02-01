import { apiClient } from 'src/services/apiClient'
import { SIGNIN_ENDPOINT } from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'
import {
  LoginRequest,
  LoginResponse,
  ServerErrorResponse,
} from '@store/auth/model/types'

export const loginApi = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse | ServerErrorResponse>(
      SIGNIN_ENDPOINT,
      credentials,
    )

    if ('_id' in response.data) {
      return response.data as LoginResponse
    }

    const errorResponse = response.data as ServerErrorResponse
    throw new Error(errorResponse.detail)
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data as ServerErrorResponse
      throw new Error(errorData.detail || 'Ошибка входа')
    }
    throw new Error('Неизвестная ошибка сети')
  }
}
