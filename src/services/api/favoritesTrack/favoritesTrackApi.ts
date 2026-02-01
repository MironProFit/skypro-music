import { apiClient } from 'src/services/apiClient'
import { Track } from '@store/catalog/model/types'
import {
  GET_FAVORITE_TRACKS,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
} from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'

export const getFavoriteTracksApi = async (token: string): Promise<Track[]> => {
  try {
    const response = await apiClient.get<Track[]>(GET_FAVORITE_TRACKS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось загрузить избранное'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}

export const addLike = async (
  token: string,
  trackId: number,
): Promise<Track> => {
  try {
    const response = await apiClient.post<Track>(
      ADD_TO_FAVORITES(trackId),
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось добавить в избранное'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}

export const removeLike = async (
  token: string,
  trackId: number,
): Promise<void> => {
  try {
    const response = await apiClient.delete(REMOVE_FROM_FAVORITES(trackId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось удалить из избранного'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}
