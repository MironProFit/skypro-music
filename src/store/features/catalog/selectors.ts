import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/store/store'
import { Track } from './model/types'

// ✅ Исправлен: добавлена типизация параметра
export const selectIsTrackFavorite = createSelector(
  [
    (state: RootState) => state.favorites.favoriteTracks,
    (_: RootState, trackId: number) => trackId, // ✅ Явная типизация
  ],
  (favoriteTracks: Track[], trackId: number) => {
    // ✅ Явная типизация
    return favoriteTracks.some((track) => track._id === trackId)
  },
)

// ✅ Селектор для получения всех треков с меткой избранного
export const selectTracksWithFavorites = createSelector(
  [
    (state: RootState) => state.tracks.list,
    (state: RootState) => state.favorites.favoriteTracks,
  ],
  (allTracks: Track[], favoriteTracks: Track[]) => {
    // ✅ Явная типизация
    const favoriteIds = new Set(favoriteTracks.map((t) => t._id))

    return allTracks.map((track) => ({
      ...track,
      isFavorite: favoriteIds.has(track._id),
    }))
  },
)

// ✅ Селектор для получения количества избранных треков
export const selectFavoriteCount = createSelector(
  [(state: RootState) => state.favorites.favoriteTracks],
  (favoriteTracks: Track[]) => favoriteTracks.length, // ✅ Явная типизация
)
