// src/hooks/useLogout.ts
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { clearFavorites } from '@store/catalog/slices/favoritesSlice'
import { clearTracksCache } from '@store/catalog/slices/tracksSlice'
import { clearSelectionCache } from '@store/catalog/slices/selectionSlice'
import { resetFormData } from '@store/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { logoutUser } from '@store/auth/slices/authSlice'

export type UseLogoutReturn = {
  logout: () => Promise<void>
  isLoggedIn: boolean
}

export const useLogout = (): UseLogoutReturn => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  const logout = async () => {
    // 🔑 Если пользователь НЕ залогинен (гость) - просто перенаправляем
    if (!isLoggedIn) {
      console.log(
        'ℹ️ Гость: перенаправление на страницу входа (кэш НЕ очищается)',
      )
      router.push('/auth/signin')
      return
    }

    try {
      console.log('🚪 Начинаем выход залогиненного пользователя...')

      // 1. Очищаем избранное
      dispatch(clearFavorites())
      console.log('✅ Избранное очищено')

      // 2. Очищаем подборки
      dispatch(clearSelectionCache())
      console.log('✅ Подборки очищены')

      // 3. 🔑 Очищаем кэш треков (И редьюсер, И localStorage)
      dispatch(clearTracksCache())
      console.log('✅ Кэш треков полностью очищен')

      // 4. Сбрасываем форму авторизации
      dispatch(resetFormData())
      console.log('✅ Форма авторизации сброшена')

      // 5. 🔑 Сбрасываем состояние аутентификации
      dispatch(logoutUser())
      console.log('✅ Состояние аутентификации сброшено')

      // Задержка для плавного UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Перенаправление
      router.push('/music/main')
      console.log('✅ Перенаправление на главную')

      // Уведомление
      toast.success('Вы успешно вышли из аккаунта', {
        autoClose: 2500,
        position: 'top-center',
        theme: 'colored',
      })
    } catch (error) {
      console.error('❌ Ошибка при выходе:', error)
      toast.error('Ошибка при выходе из аккаунта', {
        autoClose: 3000,
        position: 'top-center',
      })
    }
  }

  return { logout, isLoggedIn }
}
