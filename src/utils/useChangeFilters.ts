'use client'

import { Track } from '@store/catalog'
import { useEffect, useMemo, useState } from 'react'
import { FiltersTagType } from 'src/sharedTypes/sharedTypes'

export default function useChangeFilters(typeFilter: FiltersTagType) {
  const [listTrack, setListTrack] = useState<Track[]>([])

  useEffect(() => {
    const cached = localStorage.getItem('tracks_cache')
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        // Опционально: можно добавить проверку Array.isArray(parsed)
        setListTrack(Array.isArray(parsed) ? parsed : [])
      } catch (e) {
        console.error('Failed to parse tracks_cache from localStorage', e)
        setListTrack([])
      }
    }
  }, [])

  const uniqueValues = useMemo(() => {
    // Извлекаем значения по ключу typeFilter
    const rawValues = listTrack
      .map((track) => track[typeFilter])
      .filter(Boolean)

    // Убираем прочерки и нестроковые значения (если нужно)
    const validValues = rawValues.filter(
      (v): v is string => typeof v === 'string' && v !== '-'
    )

    // Обработка специальных случаев
    if (typeFilter === 'genre') {
      // Распаковываем массивы жанров (если genre — массив)
      const allGenres = listTrack
        .flatMap((track) => {
          const genres = track.genre
          return Array.isArray(genres) ? genres : genres ? [genres] : []
        })
        .filter((g): g is string => typeof g === 'string' && g !== '-')

      const uniqueGenres = Array.from(new Set(allGenres))
      return uniqueGenres.sort((a, b) => a.localeCompare(b))
    }

    if (typeFilter === 'release_date') {
      // Предполагаем, что дата — строка в формате 'YYYY-MM-DD' или ISO
      // Сортируем как строки (корректно для ISO)
      const uniqueDates = Array.from(new Set(validValues))
      return uniqueDates.sort((a, b) => a.localeCompare(b))
    }

    // Для остальных полей — просто уникальные строки
    const uniqueOthers = Array.from(new Set(validValues))
    return uniqueOthers.sort((a, b) => a.localeCompare(b))
  }, [listTrack, typeFilter])

  return uniqueValues
}
