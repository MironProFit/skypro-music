import { createAsyncThunk } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import { getTracksApi } from '@api/tracks/tracksApi'
import { RootState } from 'src/store/store'

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { state: RootState; rejectValue: string }
>('tracks/fetchTracks', async (_, { getState, rejectWithValue }) => {
  const tracks = getState().tracks.list
  if (tracks.length > 0) {
    console.log('✅ Треки уже загружены, пропускаем запрос')
    return tracks
  }

  try {
    const tracks = await getTracksApi()
    return tracks
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Неизвестная ошибка'
    return rejectWithValue(`Ошибка загрузки треков: ${message}`)
  }
})
