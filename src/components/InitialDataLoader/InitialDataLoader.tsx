'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { fetchTracks } from '@store/catalog/api/tracksThunk'
import { fetchAllSelections } from '@store/catalog/api/selectionThunk'
import { setIsLoadingTrackList } from '@store/catalog/slices/tracksSlice'

export default function InitialDataLoader() {
  const dispatch = useAppDispatch()

  // Получаем состояние загрузки из редьюсера
  const tracksLoading = useAppSelector((state) => state.tracks.loading)
  const tracksList = useAppSelector((state) => state.tracks.list)
  const selectionsLoading = useAppSelector((state) => state.selections.loading)
  const selectionsList = useAppSelector((state) => state.selections.list)

  // 🔑 Флаг для отслеживания инициализации
  const isInitialized = tracksList.length > 0 || selectionsList.length > 0

  useEffect(() => {
    // 🔑 КРИТИЧЕСКИ ВАЖНО: Проверяем, что данные еще НЕ загружены
    if (!isInitialized) {
      console.log('📥 Запуск инициализации данных...')

      // Устанавливаем глобальный флаг загрузки
      dispatch(setIsLoadingTrackList(true))

      // Загружаем треки (если еще не загружены)
      if (tracksList.length === 0 && !tracksLoading) {
        console.log('🎵 Загрузка треков...')
        dispatch(fetchTracks())
      }

      // Загружаем подборки (если еще не загружены)
      if (selectionsList.length === 0 && !selectionsLoading) {
        console.log('📋 Загрузка подборок...')
        dispatch(fetchAllSelections())
      }

      // Сбрасываем глобальный флаг загрузки после завершения
      // (это произойдет автоматически в редьюсерах при fulfilled/rejected)
    } else {
      console.log('✅ Данные уже загружены, повторная загрузка НЕ требуется')
    }
  }, [
    // 🔑 ЗАВИСИМОСТИ: только изменение состояния инициализации
    isInitialized,
    dispatch,
    tracksList.length,
    selectionsList.length,
    tracksLoading,
    selectionsLoading,
  ])

  // 🔑 НЕ возвращаем ничего - это невидимый компонент-загрузчик
  return null
}
