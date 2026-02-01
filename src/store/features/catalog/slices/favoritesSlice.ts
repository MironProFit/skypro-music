import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import {
  addTrackToFavorites,
  removeTrackFromFavorites,
  fetchFavoriteTracks,
} from '../api/favoritesThunk'

interface FavoritesState {
  favoriteTracks: Track[]
  isLoading: boolean
  error: string | null
}

const initialState: FavoritesState = {
  favoriteTracks: [],
  isLoading: false,
  error: null,
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addTrackLocally: (state, action: PayloadAction<Track>) => {
      if (!state.favoriteTracks.some((t) => t._id === action.payload._id)) {
        state.favoriteTracks.push(action.payload)
      }
    },
    removeTrackLocally: (state, action: PayloadAction<number>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track._id !== action.payload,
      )
    },
    clearFavorites: (state) => {
      state.favoriteTracks = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка избранного
      .addCase(fetchFavoriteTracks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFavoriteTracks.fulfilled, (state, action) => {
        state.isLoading = false
        state.favoriteTracks = action.payload
      })
      .addCase(fetchFavoriteTracks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Ошибка загрузки избранного'
      })

      // Добавление в избранное
      .addCase(addTrackToFavorites.fulfilled, (state, action) => {
        if (!state.favoriteTracks.some((t) => t._id === action.payload._id)) {
          state.favoriteTracks.push(action.payload)
        }
      })
      .addCase(addTrackToFavorites.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка добавления в избранное'
      })

      // Удаление из избранного
      .addCase(removeTrackFromFavorites.fulfilled, (state, action) => {
        state.favoriteTracks = state.favoriteTracks.filter(
          (track) => track._id !== action.payload,
        )
      })
      .addCase(removeTrackFromFavorites.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка удаления из избранного'
      })
  },
})

export const { addTrackLocally, removeTrackLocally, clearFavorites } =
  favoritesSlice.actions
export const favoritesReducer = favoritesSlice.reducer
