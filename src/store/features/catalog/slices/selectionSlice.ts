// src/store/selections/slices/selectionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SelectionsState } from '../model/types'
import { fetchAllSelections } from '../api/selectionThunk'
import { useAppSelector } from 'src/store/store'

const initialState: SelectionsState = {
  list: [],
  currentCollection: '',
  loading: false,
  error: null,
}

const selectionsSlice = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    setCurrentSelection: (state, action: PayloadAction<string>) => {
      state.currentCollection = action.payload
    },
    clearSelectionCache: (state) => {
      state.currentCollection = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSelections.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllSelections.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload

        if (action.payload.length > 0) {
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'selections_cache',
                JSON.stringify(action.payload),
              )
            }
          } catch (error) {
            console.warn('Не удалось сохранить подборки в localStorage:', error)
          }
        }
      })
      .addCase(fetchAllSelections.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Ошибка загрузки подборок'
      })
  },
})
export const { setCurrentSelection, clearSelectionCache } =
  selectionsSlice.actions
export const selectionsReducer = selectionsSlice.reducer
