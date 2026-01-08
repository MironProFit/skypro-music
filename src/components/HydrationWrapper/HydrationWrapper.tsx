// src/components/HydrationWrapper.tsx
'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'

import { fetchTracks } from '@store/catalog/api/tracksThunk'
import { setTracksFromCache } from '@store/catalog'

export function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const list = useAppSelector((state) => state.tracks.list)

  useEffect(() => {
    // Загружаем данные только если список пустой
    if (list.length === 0) {
      const cached = localStorage.getItem('tracks_cache')
      if (cached) {
        try {
          const tracks = JSON.parse(cached)
          dispatch(setTracksFromCache(tracks))
        } catch (e) {
          console.warn('Не удалось загрузить треки из кэша:', e)
          dispatch(fetchTracks())
        }
      } else {
        dispatch(fetchTracks())
      }
    }
  }, [dispatch, list.length])

  return <>{children}</>
}
