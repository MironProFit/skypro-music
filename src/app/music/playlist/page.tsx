'use client'

import TrackList from '@components/TrackList/TrackList'
import { useAppSelector } from 'src/store/store'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

export default function PlaylistPage() {
  const router = useRouter()
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn)
  const favoriteTracks = useAppSelector((s) => s.favorites.favoriteTracks)

  // Защита маршрута
  if (!isLoggedIn) {
    router.push('/')
    return null
  }

  const favoriteTrackIds = useMemo(() => {
    return favoriteTracks.map((track) => track._id)
  }, [favoriteTracks])

  return (
    <TrackList
      categoryName="Мой плейлист"
      categoryTrackIds={favoriteTrackIds}
    />
  )
}
