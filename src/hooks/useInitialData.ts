
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { fetchFavoriteTracks } from '@store/catalog/api/favoritesThunk'
import { selectAuthTokens } from '@store/auth/slices/authSlice'
import { fetchTracks } from '@store/catalog/api/tracksThunk'

export const useInitialData = () => {
  const dispatch = useAppDispatch()
  const tracksLoaded = useAppSelector((state) => state.tracks.list.length > 0)
  const tokenAccess = useAppSelector(selectAuthTokens).access

  useEffect(() => {
    // Загружаем все треки при первом рендере
    if (!tracksLoaded) {
      dispatch(fetchTracks())
    }
  }, [dispatch, tracksLoaded])

  useEffect(() => {
    // Загружаем избранные треки, если есть токен доступа
    if (tokenAccess) {
      dispatch(fetchFavoriteTracks())
    }
  }, [dispatch, tokenAccess])
}