'use client'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { fetchFavoriteTracks } from '@store/catalog/api/favoritesThunk'
import { selectAuthTokens } from '@store/auth/slices/authSlice' 

import { fetchTracks } from '@store/catalog/api/tracksThunk'

 const useInitialData = () => {
  const dispatch = useAppDispatch()
  const tracksLoaded = useAppSelector((state) => state.tracks.list.length > 0)
  const tracksLoading = useAppSelector((state) => state.tracks.loading)

  const { tokenAccess } = useAppSelector(selectAuthTokens)

  useEffect(() => {
    // Загружаем треки только если они ещё не загружены и не загружаются
    if (!tracksLoaded && !tracksLoading) {
      dispatch(fetchTracks())
    }
  }, [dispatch, tracksLoaded, tracksLoading])

  useEffect(() => {
    if (tokenAccess && tracksLoaded && !tracksLoading) {
      dispatch(fetchFavoriteTracks())
    }
  }, [dispatch, tokenAccess, tracksLoaded, tracksLoading])
}
export default useInitialData
