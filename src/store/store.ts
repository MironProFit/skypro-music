import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { trackSliceReducer } from './features/trackSlise'
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux'
import authSliceReducer from './features/authSlice'

export const makeStore = () => {
  const isDev =
    typeof window !== 'undefined' && process.env.NODE_ENV === 'development'

  return configureStore({
    reducer: combineReducers({
      track: trackSliceReducer,
      auth: authSliceReducer,
    }),
    devTools: isDev
      ? {
          name: 'Music App Store',
          trace: true,
          traceLimit: 25,
          maxAge: 30,
        }
      : false,
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = () => useStore<AppStore>()
