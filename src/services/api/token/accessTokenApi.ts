import { ServerErrorResponse, TokenPairResponse } from '@store/auth/model/types'
import { TOKEN_ENDPOINT } from 'src/config/apiEndpoints'

import { apiClient } from 'src/services/apiClient'

export const getTokenApi = async (
  email: string,
  password: string,
): Promise<TokenPairResponse> => {
 
    const res = await apiClient.post<TokenPairResponse | ServerErrorResponse>(
      TOKEN_ENDPOINT,
      { email, password },
      
    )
    if ('access' in res.data && 'refresh' in res.data ) {
      return res.data as TokenPairResponse
    }
    throw new Error((res.data as ServerErrorResponse).detail)

}
