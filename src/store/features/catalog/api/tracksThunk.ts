import { createAsyncThunk } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import { getTracksApi } from '@api/tracks/tracksApi'

const getEra = (yearStr: string): string => {
  const year = parseInt(yearStr, 10)
  if (isNaN(year)) return 'Неизвестно'

  const currentYear = new Date().getFullYear()

  if (year >= 2020 && year <= currentYear) {
    return 'Новые'
  } else if (year >= 2015) {
    return 'Сейчас популярны'
  } else {
    return 'Старые хиты'
  }
}

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>('catalog/fetchTracks', async (_, { rejectWithValue }) => {
  try {
    const tracks = await getTracksApi()
    const getEra = (yearStr: string): string => {
      const year = parseInt(yearStr, 10)
      if (isNaN(year)) return 'Неизвестно'

      const currentYear = new Date().getFullYear()

      if (year >= 2020 && year <= currentYear) {
        return 'Новые'
      } else if (year >= 2015) {
        return 'Сейчас популярны'
      } else {
        return 'Старые хиты'
      }
    }
    return tracks
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Произошла неизвестная ошибка')
  }
})
