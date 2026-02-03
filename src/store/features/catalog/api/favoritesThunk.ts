import { createAsyncThunk } from '@reduxjs/toolkit'
import { Track } from '../model/types'
import { AppDispatch, RootState } from 'src/store/store'
import { withReauth } from '@api/reauth'
import {
  addLike,
  getFavoriteTracksApi,
  removeLike,
} from '@api/favoritesTrack/favoritesApi'

export const addTrackToFavorites = createAsyncThunk<
  Track,
  number,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'favorites/addTrackToFavorites',
  async (trackId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { tokenAccess, tokenRefresh } = getState().auth.userData

      if (!tokenAccess || !tokenRefresh) {
        return rejectWithValue('Нет авторизации')
      }

      const result = await withReauth<Track>(
        (token) => addLike(token, trackId), // 1. apiFunction
        tokenAccess, // 2. currentAccess ← НОВЫЙ аргумент!
        tokenRefresh || '', // 3. refresh
        dispatch, // 4. dispatch
      )
      console.log(result);

      return result
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      return rejectWithValue(`Ошибка добавления в избранное: ${message}`)
    }
  },
)

export const removeTrackFromFavorites = createAsyncThunk<
  number,
  number,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'favorites/removeTrackFromFavorites',
  async (trackId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { tokenAccess, tokenRefresh } = getState().auth.userData

      if (!tokenAccess || !tokenRefresh) {
        return rejectWithValue('Нет авторизации')
      }

      await withReauth<void>(
        (token) => removeLike(token, trackId), // 1. apiFunction
        tokenAccess, // 2. currentAccess ← НОВЫЙ аргумент!
        tokenRefresh || '', // 3. refresh
        dispatch, // 4. dispatch
      )

      return trackId
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      return rejectWithValue(`Ошибка удаления из избранного: ${message}`)
    }
  },
)

export const fetchFavoriteTracks = createAsyncThunk<
  Track[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'favorites/fetchFavoriteTracks',
  async (_, { getState, dispatch, rejectWithValue }) => {
    console.log('Запуск fetchFavoriteTracks');
    try {

      const { tokenAccess, tokenRefresh } = getState().auth.userData

      if (!tokenAccess || !tokenRefresh) {
        return rejectWithValue('Нет авторизации')
      }

      const tracks = await withReauth<Track[]>(
        (token) => getFavoriteTracksApi(token),
        tokenAccess,
        tokenRefresh || '',
        dispatch,
      )
      console.log(tracks);

      return tracks
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      return rejectWithValue(`Ошибка получения избранного: ${message}`)
    }
  },
)
