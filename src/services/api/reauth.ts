import { AxiosError, isAxiosError } from 'axios'
import { AppDispatch } from 'src/store/store'
import { refreshTokenApi } from './token/refreshTokenApi'
import { setAccessToken } from '@store/auth/slices/authSlice'

export const withReauth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  currentAccess: string,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  try {
    // ✅ Сначала пытаемся с текущим токеном
    return await apiFunction(currentAccess)
  } catch (error) {
    // ✅ Проверяем ТОЛЬКО ошибки 401 от Axios
    if (isAxiosError(error) && error.response?.status === 401) {
      console.log('🔐 401 — обновляем токен...')
      
      try {
        const newAccessToken = await refreshTokenApi(refresh)
        dispatch(setAccessToken(newAccessToken.access))
        console.log('✅ Токен обновлён, повторяем запрос')
        
        // Повторяем с новым токеном
        return await apiFunction(newAccessToken.access)
      } catch (refreshError) {
        console.error('❌ Обновление токена не удалось')
        // Пробрасываем понятную ошибку для обработки в компоненте
        throw new Error('auth/invalid-token')
      }
    }
    
    // Все остальные ошибки пробрасываем без изменений
    throw error
  }
}