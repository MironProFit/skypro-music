// src/components/HydrationWrapper.tsx
'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { fetchTracks } from '@store/catalog/api/tracksThunk'


export function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  const list = useAppSelector((state) => state.tracks.list)

  useEffect(() => {
    // Загружаем данные только если список пустой И пользователь залогинен
    if (list.length === 0 && isLoggedIn) {
      dispatch(fetchTracks())
    }
  }, [dispatch, list.length, isLoggedIn])

  return <>{children}</>
}