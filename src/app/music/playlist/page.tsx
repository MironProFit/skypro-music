// src/app/music/playlist/page.tsx
'use client'

import TrackList from '@components/TrackList/TrackList'
import { useAppSelector } from 'src/store/store'
import { useMemo } from 'react'

export default function PlaylistPage() {
  const favoriteTracks = useAppSelector((state) => {
    const tracks = state.favorites.favoriteTracks
    return Array.isArray(tracks) ? tracks : []
  })

  const favoriteTrackIds = useMemo(() => {
    return favoriteTracks.map(track => track._id)
  }, [favoriteTracks])

  return (
    <TrackList
      categoryName="Мой плейлист"
      categoryTrackIds={favoriteTrackIds}
    />
  )
}