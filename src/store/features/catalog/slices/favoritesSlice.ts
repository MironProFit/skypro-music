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

const loadFromLocalStorage = (): Track[] => {
  if (typeof window !== undefined) return []
  try {
    const stored = localStorage.getItem('favoriteTracks')
    if (stored) {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.error('Ошибка загрузки избранного из localStorage:', error)
  }
  return []
}

const initialState: FavoritesState = {
  favoriteTracks: loadFromLocalStorage(),
  isLoading: false,
  error: null,
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addTrackLocally: (state, action: PayloadAction<Track>) => {
      if (!state.favoriteTracks.some((t) => t._id === action.payload._id)) {
        state.favoriteTracks = [...state.favoriteTracks, action.payload]
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
        state.favoriteTracks = Array.isArray(action.payload)
          ? action.payload
          : []

        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'favoriteTracks',
              JSON.stringify(state.favoriteTracks),
            )
          }
        } catch (error) {
          console.error('Ошибка при сохранении favoriteTracks:', error)
        }
      })
      .addCase(fetchFavoriteTracks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Ошибка загрузки избранного'
      })

      // Добавление в избранное
      .addCase(addTrackToFavorites.fulfilled, (state, action) => {
        if (!state.favoriteTracks.some((t) => t._id === action.payload._id)) {
          state.favoriteTracks = [...state.favoriteTracks, action.payload]

          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'favoriteTracks',
                JSON.stringify(action.payload),
              )
            }
          } catch (error) {
            console.error('Ошибка добавления в LocalStorage:', error)
          }
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
        try {
          localStorage.setItem(
            'favoriteTracks',
            JSON.stringify(state.favoriteTracks),
          )
        } catch (error) {
          console.error('Ошибка добавления в LocalStorage:', error)
        }
      })

      .addCase(removeTrackFromFavorites.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка удаления из избранного'
      })
  },
})

export const { addTrackLocally, removeTrackLocally, clearFavorites } =
  favoritesSlice.actions
export const favoritesReducer = favoritesSlice.reducer
