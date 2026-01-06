import { LoginUserResponse } from '@store/auth/model/loginUser.types'
import axios, { isAxiosError } from 'axios'
import { BASE_API_URL, SIGNIN_ENDPOINT } from 'src/constants'

export const loginApi = async (
  email: string,
  password: string,
  signal?: AbortSignal
): Promise<LoginUserResponse> => {
  try {
    const res = await axios.post<LoginUserResponse>(
      `${BASE_API_URL}${SIGNIN_ENDPOINT}`,
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
