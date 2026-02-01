import { apiClient } from 'src/services/apiClient'
import { Selection, SelectionResponse } from '@store/catalog/model/types'
import { GET_ALL_SELECTIONS, GET_SELECTION_BY_ID, CREATE_SELECTION } from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'

export const getSelectionsApi = async (): Promise<Selection[]> => {
  try {
    const response = await apiClient.get<SelectionResponse>(GET_ALL_SELECTIONS)
    
    if (!response.data.success) {
      console.error(
        'Ошибка API:',
        response.data.message || 'Не удалось загрузить подборки'
      )
    }

    return response.data.data  // ✅ Теперь data — это Selection[]
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось загрузить подборки'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}

export const getSelectionByIdApi = async (id: number): Promise<Selection> => {
  try {
    const response = await apiClient.get<Selection>(GET_SELECTION_BY_ID(id))
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось загрузить подборку'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}

export const createSelectionApi = async (
  name: string,
  items: number[],
  token: string
): Promise<Selection> => {
  try {
    const response = await apiClient.post<Selection>(
      CREATE_SELECTION,
      { name, items },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось создать подборку'
      throw new Error(`Ошибка API: ${message}`)
    }
    throw new Error('Неизвестная ошибка сети')
  }
}