import { LoginResponse } from '@store/auth'
import { isAxiosError } from 'axios'
import { SIGNIN_ENDPOINT } from 'src/config/apiEndpoints'
import { apiClient } from 'src/services/apiClient'

export const loginApi = async (
  email: string,
  password: string,
  signal?: AbortSignal
): Promise<LoginResponse> => {
  try {
    const res = await apiClient.post<LoginResponse>(
      SIGNIN_ENDPOINT,
      { email, password },
      {
        signal,
      }
    )
    return res.data
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      }
    }
    return {
      success: false,
      message: 'Произошла неожиданная ошибка',
    }
  }
}
