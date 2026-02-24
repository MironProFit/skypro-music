// src/store/catalog/slices/tracksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import { fetchTracks } from '../api/tracksThunk'

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
    clearTracksCache: (state) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('tracks_cache')
          console.log('🧹 Кэш треков удален из localStorage')
        } catch (error) {
          console.warn('⚠️ Не удалось удалить треки из localStorage:', error)
        }
      }
      state.list = []
      state.loading = false // 🔑 Гарантируем сброс загрузки
      console.log('🧹 Кэш треков очищен из редьюсера')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true
        state.error = null
        console.log('⏳ fetchTracks: pending')
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.loading = false // 🔑 Обязательно сбрасываем
        state.list = action.payload
        state.error = null
        console.log('✅ fetchTracks: fulfilled, треков:', action.payload.length)
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false // 🔑 Обязательно сбрасываем
        state.error = action.payload ?? 'Неизвестная ошибка'
        console.log('❌ fetchTracks: rejected', state.error)
      })
  },
})

export const {
  setCurrentTrack,
  setIsPlayTrack,
  setTracksFromCache,
  setIsLoadingTrackList,
  clearTracksCache,
} = trackSlice.actions

export const trackSliceReducer = trackSlice.reducer
