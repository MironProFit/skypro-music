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

const loadTrackFromLocalStorage = (): Track[] => {
  if (typeof window === 'undefined') {
    return []
  }
  try {
    const cached = localStorage.getItem('tracks_cache')
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    console.warn('Не удалось загрузить треки из localStorage:', error)
    return []
  }
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
  },
})

export const { setCurrentTrack, setIsPlayTrack, setTracksFromCache } =
  trackSlice.actions
export const trackSliceReducer = trackSlice.reducer
