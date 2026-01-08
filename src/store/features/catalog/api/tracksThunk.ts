import { createAsyncThunk } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import { getTracksApi } from '@api/tracks/tracksApi'

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>('catalog/fetchTracks', async (_, { rejectWithValue }) => {
  try {
    const tracks = await getTracksApi()
    return tracks
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Произошла неизвестная ошибка')
  }
})
