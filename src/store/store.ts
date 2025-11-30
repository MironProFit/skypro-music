import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { trackSliceReducer } from './features/trackSlise'
import { TypedUseSelectorHook, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useStore } from 'react-redux'

export const makeStore = () => {
  return configureStore({
    reducer: combineReducers({
      track: trackSliceReducer,
    }),
  })
}

export type AppStore = ReturnType<typeof makeStore>

type RootState = ReturnType<AppStore['getState']>
type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = () => useStore<AppStore>()
