// src/api/favorites/favoritesApi.ts
import { apiClient } from 'src/services/apiClient'
import { Track } from '@store/catalog/model/types'
import { 
  GET_FAVORITE_TRACKS, 
  ADD_TO_FAVORITES, 
  REMOVE_FROM_FAVORITES 
} from 'src/config/apiEndpoints'

// ✅ УДАЛЯЕМ импорт isAxiosError и обработку ошибок!

interface FavoriteTracksResponse {
  success: boolean
  data: Track[]
  message?: string
}

export const getFavoriteTracksApi = async (
  token: string
): Promise<Track[]> => {
  const response = await apiClient.get<FavoriteTracksResponse>(
    GET_FAVORITE_TRACKS,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.data.success) {
    throw new Error(response.data.message || 'Не удалось загрузить избранное')
  }

  return response.data.data
}

export const addLike = async (
  token: string,
  trackId: number
): Promise<Track> => {
  const response = await apiClient.post<Track>(
    ADD_TO_FAVORITES(trackId),
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

export const removeLike = async (
  token: string,
  trackId: number
): Promise<void> => {
  await apiClient.delete(
    REMOVE_FROM_FAVORITES(trackId),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}