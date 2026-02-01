import { apiClient } from 'src/services/apiClient'
import { Track, TrackApiResponse } from '@store/catalog/model/types'
import { GET_ALL_TRACKS, GET_TRACK_BY_ID } from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'

export const getTracksApi = async (): Promise<Track[]> => {
  try {
    const response = await apiClient.get<TrackApiResponse>(GET_ALL_TRACKS)
    if (!response.data.success) {
      console.error(
        'Ошибка API:',
        response.data.message || 'Не удалось загрузить треки',
      )
    }

    return response.data.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось загрузить треки'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}

export const getTrackByIdApi = async (id: number): Promise<Track> => {
  try {
    const response = await apiClient.get<Track>(GET_TRACK_BY_ID(id))
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось загрузить трек'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}
