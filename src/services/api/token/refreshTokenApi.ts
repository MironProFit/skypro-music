import {
  RefreshTokenResponse,
  ServerErrorResponse,
} from '@store/auth/model/types'
import { REFRESH_TOKEN_ENDPOINT } from 'src/config/apiEndpoints'

import { apiClient } from 'src/services/apiClient'

export const refreshTokenApi = async (
  refresh: string,
): Promise<RefreshTokenResponse> => {
  const res = await apiClient.post<RefreshTokenResponse | ServerErrorResponse>(
    REFRESH_TOKEN_ENDPOINT,
    { refresh },
  )
  if ('access' in res.data) {
    return res.data as RefreshTokenResponse
  }
  throw new Error((res.data as ServerErrorResponse).detail)
}
