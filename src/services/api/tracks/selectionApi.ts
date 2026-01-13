// src/store/selections/api/selectionsThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from 'src/services/apiClient'
import { GET_ALL_SELECTIONS } from 'src/config/apiEndpoints'
import { isAxiosError } from 'axios'

export const fetchAllSelections = createAsyncThunk<
  Selection[],
  void,
  { rejectValue: string }
>('selections/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{
      success: boolean
      data: Selection[]
    }>(GET_ALL_SELECTIONS)
    return response.data.data
  } catch (error) {
    if (isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Не удалось загрузить подборки'
      return rejectWithValue(message)
    }
    return rejectWithValue('Неизвестная ошибка сети')
  }
})
