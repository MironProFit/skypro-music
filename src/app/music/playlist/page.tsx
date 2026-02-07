// src/app/music/playlist/page.tsx
'use client'

import TrackList from '@components/TrackList/TrackList'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { useEffect, useMemo } from 'react'
import { selectAuthTokens } from '@store/auth'
import { fetchFavoriteTracks } from '@store/catalog/api/favoritesThunk'
import styles from './page.module.css'
import { usePathname, useRouter } from 'next/navigation'

export default function PlaylistPage() {
  const dispatch = useAppDispatch()
  const { tokenAccess } = useAppSelector(selectAuthTokens)
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn)
  const pathname = usePathname()
  const router = useRouter()

  const favoriteTracks = useAppSelector((s) => {
    const tracks = s.favorites.favoriteTracks
    return Array.isArray(tracks) ? tracks : []
  })

  useEffect(() => {
    !isLoggedIn && pathname === '/music/playlist' && router.push('/')
  }, [pathname, isLoggedIn])

  const favoritesLoading = useAppSelector((s) => s.favorites.isLoading)
  const favoritesError = useAppSelector((s) => s.favorites.error)

  useEffect(() => {
    if (tokenAccess && !favoritesLoading && favoriteTracks.length === 0) {
      console.log('Загружаю избранные треки с сервера')
      dispatch(fetchFavoriteTracks())
    }
  }, [dispatch, tokenAccess, favoritesLoading, favoriteTracks.length])

  const favoriteTrackIds = useMemo(() => {
    return favoriteTracks.map((track) => track._id)
  }, [favoriteTracks])

  if (favoritesLoading && favoriteTracks.length === 0) {
    return (
      <div className={styles.centerblock}>
        <div className={styles.emptyState}>
          <p>Загрузка плейлиста...</p>
        </div>
      </div>
    )
  }

  if (favoritesError) {
    return (
      <div className={styles.centerblock}>
        <div className={styles.emptyState}>
          <p>Ошибка загрузки плейлиста</p>
          <p className={styles.emptyStateSubtitle}>{favoritesError}</p>
        </div>
      </div>
    )
  }

  return (
    <TrackList
      categoryName="Мой плейлист"
      categoryTrackIds={favoriteTrackIds}
    />
  )
}
