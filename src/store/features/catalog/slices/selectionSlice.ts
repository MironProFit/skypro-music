// src/store/selections/slices/selectionsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SelectionsState } from '../model/types'
import { fetchAllSelections } from '../api/selectionThunk'

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