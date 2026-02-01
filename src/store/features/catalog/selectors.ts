import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/store/store'
import { Track } from './model/types'

export const selectIsTrackFavorite = createSelector(
  [
    (state: RootState) => state.favorites.favoriteTracks,
    (_: RootState, trackId: number) => trackId,
  ],
  (favoriteTracks: Track[], trackId: number) => {
    return favoriteTracks.some((track) => track._id === trackId)
  },
)

export const selectTracksWithFavorites = createSelector(
  [
    (state: RootState) => state.tracks.list,
    (state: RootState) => state.favorites.favoriteTracks,
  ],
  (allTracks: Track[], favoriteTracks: Track[]) => {
    const favoriteIds = new Set(favoriteTracks.map((t) => t._id))

    return allTracks.map((track) => ({
      ...track,
      isFavorite: favoriteIds.has(track._id),
    }))
  },
)

export const selectFavoriteCount = createSelector(
  [(state: RootState) => state.favorites.favoriteTracks],
  (favoriteTracks: Track[]) => favoriteTracks.length,
)
