import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginRequest, User } from '../index'
import { fetchTracks } from '@store/catalog/api/tracksThunk'
import { fetchAllSelections } from '@store/catalog/api/selectionThunk'
import { loginApi } from '@api/auth/loginApi'
import { getUserToken } from './tokenThunk' // ✅ Добавляем импорт
import { RootState, AppDispatch } from 'src/store/store'

export const loginUser = createAsyncThunk<
  User,
  LoginRequest,
  {
    state: RootState
    dispatch: AppDispatch
    rejectValue: string
  }
>(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch, getState }) => {
    try {
      console.log('📤 Начинаем авторизацию:', { email })

      const data = await loginApi({ email, password })

      console.log('✅ Ответ от loginApi:', data)

      if ('_id' in data) {
        console.log('✅ Успешная авторизация, пользователь ID:', data._id)

        // ✅ Получаем токен после успешного логина
        try {
          const tokenResult = await dispatch(
            getUserToken({ email, password }),
          ).unwrap()
          console.log('✅ Токен получен:', tokenResult.access)
        } catch (tokenError) {
          console.warn('⚠️ Ошибка получения токена:', tokenError)
          // Не прерываем выполнение — продолжаем
        }

        // ✅ Загружаем подборки (треки уже загружены в InitialDataLoader)
        try {
          await dispatch(fetchAllSelections())
          console.log('✅ Подборки загружены')
        } catch (selectionError) {
          console.warn('⚠️ Ошибка загрузки подборок:', selectionError)
        }

        return data
      } else {
        // Обработка ошибки от сервера
        const message =
          (data as { message?: string; detail?: string })?.message ||
          (data as { message?: string; detail?: string })?.detail ||
          'Ошибка авторизации'

        console.warn('❌ Ошибка авторизации от сервера:', message)
        return rejectWithValue(`❌ ${message}`)
      }
    } catch (error) {
      console.error('💥 Критическая ошибка в loginUser:', error)

      let errorMessage = 'Неизвестная ошибка сети'

      if (error instanceof Error) {
        errorMessage = error.message

        // Специальная обработка для разных типов ошибок
        if (errorMessage.includes('timeout')) {
          errorMessage = '⏱️ Таймаут запроса. Проверьте интернет-соединение.'
        } else if (
          errorMessage.includes('Network Error') ||
          errorMessage.includes('ERR_NETWORK')
        ) {
          errorMessage =
            '🌐 Проблема с сетью. Проверьте подключение к интернету.'
        } else if (errorMessage.includes('401')) {
          errorMessage = '🔐 Неверный логин или пароль.'
        } else if (errorMessage.includes('400')) {
          errorMessage = '❌ Некорректные данные. Проверьте логин и пароль.'
        } else if (
          errorMessage.includes('CORS') ||
          errorMessage.includes('blocked')
        ) {
          errorMessage = '🔒 Ошибка CORS. Обратитесь к администратору сервера.'
        }
      }

      console.error('💥 Итоговое сообщение об ошибке:', errorMessage)
      return rejectWithValue(`💥 ${errorMessage}`)
    }
  },
)
