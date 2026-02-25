'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { fetchTracks } from '@store/catalog/api/tracksThunk'
import { fetchFavoriteTracks } from '@store/catalog/api/favoritesThunk'
import { fetchAllSelections } from '@store/catalog/api/selectionThunk'
// src/components/HydrationWrapper.tsx

export function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  const tracksLoaded = useAppSelector((state) => state.tracks.list.length > 0)
  const favoritesLoaded = useAppSelector((state) => state.favorites.favoriteTracks.length > 0)
  const selectionsLoaded = useAppSelector((state) => state.selections.list.length > 0)

  useEffect(() => {
    if (isLoggedIn) {
      // Загружаем каталог треков
      if (!tracksLoaded) {
        dispatch(fetchTracks())
      }
      // Загружаем избранное
      if (!favoritesLoaded) {
        dispatch(fetchFavoriteTracks())
      }
      // Загружаем подборки
      if (!selectionsLoaded) {
        dispatch(fetchAllSelections())
      }
    }
  }, [dispatch, isLoggedIn, tracksLoaded, favoritesLoaded, selectionsLoaded])

  return <>{children}</>
}