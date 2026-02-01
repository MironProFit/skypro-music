import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import { fetchTracks } from '../api/tracksThunk'
import {
  addTrackToFavorites,
  fetchFavoriteTracks,
  removeTrackFromFavorites,
} from '../api/favoritesThunk'

type initialStateType = {
  list: Track[]
  loading: boolean
  error: string | null
  currentTrack: Track | null
  isPlayTrack: boolean
}



const initialState: initialStateType = {
  list: [],
  loading: false,
  error: null,
  currentTrack: null,
  isPlayTrack: false,
}

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload
    },
    setIsPlayTrack: (state, action: PayloadAction<boolean>) => {
      state.isPlayTrack = action.payload
    },
    setTracksFromCache: (state, action: PayloadAction<Track[]>) => {
      state.list = action.payload
    },
    setIsLoadingTrackList: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('tracks_cache', JSON.stringify(action.payload))
          } catch (error) {
            console.warn('Не удалось сохранить треки в localStorage:', error)
          }
        }
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Неизвестная ошибка'
      })

    // ✅ Удалён код с добавлением isFavorite (это не должно быть в tracksSlice)
    // Логика избранного должна быть в favoritesSlice или в селекторах
  },
})

export const {
  setCurrentTrack,
  setIsPlayTrack,
  setTracksFromCache,
  setIsLoadingTrackList,
} = trackSlice.actions
export const trackSliceReducer = trackSlice.reducer
