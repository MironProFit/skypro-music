import { Track, TrackApiResponse } from '@store/catalog'
import { isAxiosError } from 'axios'
import { GET_ALL_TRACKS } from 'src/config/apiEndpoints'
import { apiClient } from 'src/services/apiClient'

export const getTracksApi = async (): Promise<Track[]> => {
  try {
    const response = await apiClient.get<TrackApiResponse>(GET_ALL_TRACKS)
    if (!response.data.success) {
      console.error(
        'Ошибка API:',
        response.data.message || 'Не удалось загрузить треки'
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
