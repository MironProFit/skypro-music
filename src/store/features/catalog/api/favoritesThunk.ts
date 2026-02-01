import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState, AppDispatch } from 'src/store/store'
import { withReauth } from '@api/reauth'
import { Track } from '@store/catalog/model/types'
import {
  addLike,
  getFavoriteTracksApi,
  removeLike,
} from '@api/favoritesTrack/favoritesTrackApi'

// ==================================================
// ДОБАВИТЬ ТРЕК В ИЗБРАННОЕ
// ==================================================
export const addTrackToFavorites = createAsyncThunk<
  Track,
  number,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'favorites/addTrackToFavorites',
  async (trackId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { tokenAccess, tokenRefresh } = getState().auth.userData

      if (!tokenAccess) {
        return rejectWithValue('Нет авторизации')
      }

      const result = await withReauth<Track>(
        (token) => addLike(token || tokenAccess, trackId),
        tokenRefresh || '',
        dispatch,
      )

      return result
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      return rejectWithValue(`Ошибка добавления в избранное: ${message}`)
    }
  },
)

// ==================================================
// УДАЛИТЬ ТРЕК ИЗ ИЗБРАННОГО
// ==================================================
export const removeTrackFromFavorites = createAsyncThunk<
  number,
  number,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'favorites/removeTrackFromFavorites',
  async (trackId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { tokenAccess, tokenRefresh } = getState().auth.userData

      if (!tokenAccess) {
        return rejectWithValue('Нет авторизации')
      }

      await withReauth<void>(
        (token) => removeLike(token || tokenAccess, trackId),
        tokenRefresh || '',
        dispatch,
      )

      return trackId
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      return rejectWithValue(`Ошибка удаления из избранного: ${message}`)
    }
  },
)

// ==================================================
// ПОЛУЧИТЬ ИЗБРАННЫЕ ТРЕКИ
// ==================================================
export const fetchFavoriteTracks = createAsyncThunk<
  Track[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'favorites/fetchFavoriteTracks',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { tokenAccess, tokenRefresh } = getState().auth.userData

      if (!tokenAccess) {
        return rejectWithValue('Нет авторизации')
      }

      const tracks = await withReauth<Track[]>(
        (token) => getFavoriteTracksApi(token || tokenAccess),
        tokenRefresh || '',
        dispatch,
      )

      return tracks
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      return rejectWithValue(`Ошибка получения избранного: ${message}`)
    }
  },
)
