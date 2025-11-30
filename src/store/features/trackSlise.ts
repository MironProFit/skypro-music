import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TrackType } from 'src/sharedTypes/sharedTypes'

type initialStateType = {
  currentTrack: TrackType | null
  isPlayTrack: boolean
}

const initialState: initialStateType = {
  currentTrack: null,
  isPlayTrack: false,
}

console.log('Current track:', initialState.currentTrack)

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload
    },
    setIsPlayTrack: (state, action: PayloadAction<boolean>) => {
      state.isPlayTrack = action.payload
    },
  },
})

export const { setCurrentTrack, setIsPlayTrack } = trackSlice.actions
export const trackSliceReducer = trackSlice.reducer
