'use client'
import { selectAuthTokens } from '@store/auth'
import { fetchFavoriteTracks } from '@store/catalog/api/favoritesThunk'
import { fetchTracks } from '@store/catalog/api/tracksThunk'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'

export default function InitialDataLoader() {
  const dispatch = useAppDispatch()
  const { tokenAccess } = useAppSelector(selectAuthTokens)
  const tracksLoaded = useAppSelector((state) => state.tracks.list.length > 0)

  useEffect(() => {
    // Загружаем все треки при старте
    if (!tracksLoaded) {
      dispatch(fetchTracks())
    }
  }, [dispatch, tracksLoaded])

  useEffect(() => {
    // Загружаем избранное при наличии токена
    if (tokenAccess && tracksLoaded) {
      dispatch(fetchFavoriteTracks())
    }
  }, [dispatch, tokenAccess, tracksLoaded])

  return null
}
