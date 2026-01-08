import { createAsyncThunk } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import { apiClient } from 'src/services/apiClient'
import { GET_ALL_TRACKS } from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>('catalog/fetchTracks', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get<Track[]>(GET_ALL_TRACKS)
    return res.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось загрузить треки'
      return rejectWithValue(`❌ Ошибка: ${message}`)
    }
    return rejectWithValue('❌ Неизвестная ошибка сети')
  }
})
