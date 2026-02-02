// src/hooks/useToggleLike.ts
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { addTrackToFavorites, removeTrackFromFavorites } from '@store/catalog/api/favoritesThunk'
import { addTrackLocally, removeTrackLocally } from '@store/catalog/slices/favoritesSlice'
import { selectAuthTokens } from '@store/auth/slices/authSlice'
import { Track } from '@store/catalog/model/types'

export const useToggleLike = () => {
  const dispatch = useAppDispatch()
  const { tokenAccess } = useAppSelector(selectAuthTokens)

  const toggleLike = useCallback(
    async (trackId: number, isLiked: boolean, track: Track) => {
      if (!tokenAccess) {
        console.warn('⚠️ Попытка поставить лайк без авторизации')
        return false
      }

      // Оптимистичное обновление
      if (isLiked) {
        dispatch(removeTrackLocally(trackId))
      } else {
        dispatch(addTrackLocally(track))
      }

      // Запрос на сервер
      try {
        if (isLiked) {
          await dispatch(removeTrackFromFavorites(trackId)).unwrap()
          console.log('✅ Трек удалён из избранного')
        } else {
          await dispatch(addTrackToFavorites(trackId)).unwrap()
          console.log('✅ Трек добавлен в избранное')
        }
        return true
      } catch (error) {
        console.error('❌ Ошибка при обновлении лайка:', error)
        
        // Откат при ошибке
        if (isLiked) {
          dispatch(addTrackLocally(track))
        } else {
          dispatch(removeTrackLocally(trackId))
        }
        return false
      }
    },
    [dispatch, tokenAccess]
  )

  return { toggleLike, tokenAccess }
}