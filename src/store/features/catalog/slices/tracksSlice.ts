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
    // === УДАЛЕНО: setTracksFromCache ===
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
        state.error = null
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Неизвестная ошибка'
      })
  },
})

export const {
  setCurrentTrack,
  setIsPlayTrack,
  setIsLoadingTrackList,
} = trackSlice.actions

export const trackSliceReducer = trackSlice.reducer