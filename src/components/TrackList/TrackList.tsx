// src/components/TrackList/TrackList.tsx
'use client'

import clsx from 'clsx'
import styles from './TrackList.module.css'
import Link from 'next/link'
import Search from '@components/Search/Search'
import SortDropdown from '@components/SortDropdown/SortDropdown'
import { useEffect, useMemo, useState } from 'react'
import { FiltersTagType } from 'src/sharedTypes/sharedTypes'
import { Track } from '@store/catalog/model/types'
import {
  setCurrentTrack,
  setIsPlayTrack,
} from '@store/catalog/slices/tracksSlice'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import Skeleton from '@components/Skeleton/Skeleton'
import { useFilters } from 'src/hooks/useSelectedFilter'
import {
  addTrackToFavorites,
  removeTrackFromFavorites,
} from '@store/catalog/api/favoritesThunk'
import { selectAuthTokens } from '@store/auth/slices/authSlice'
import {
  addTrackLocally,
  removeTrackLocally,
} from '@store/catalog/slices/favoritesSlice'
import { usePathname } from 'next/navigation'

type TrackListProps = {
  categoryName?: string
  categoryTrackIds?: number[]
}

type FilterState = '' | FiltersTagType

export default function TrackList({
  categoryName,
  categoryTrackIds,
}: TrackListProps) {
  const [typeFilter, setTypeFilter] = useState<FilterState>('')
  const [yearMode, setYearMode] = useState<
    'default' | 'new-first' | 'old-first'
  >('default')
  const [searchQuery, setSearchQuery] = useState('')

  const { tokenAccess } = useAppSelector(selectAuthTokens)
  const favoriteTracks = useAppSelector((state) => {
    const tracks = state.favorites.favoriteTracks
    if (!Array.isArray(tracks)) {
      console.warn('⚠️ favoriteTracks не является массивом:', tracks)
    }
    return tracks || []
  })

  const playTrack = useAppSelector((state) => state.tracks.currentTrack?._id)
  const isPlayTrack = useAppSelector((state) => state.tracks.isPlayTrack)
  const allTracks = useAppSelector((state) => state.tracks.list)
  const { filters: selectedFilters, toggleFilter } = useFilters()
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const isLoading = Array.isArray(allTracks) && allTracks.length > 0

  const tracksToDisplay = useMemo(() => {
    if (
      (!categoryTrackIds || categoryTrackIds.length === 0) &&
      pathname !== '/music/playlist'
    ) {
      return allTracks
    }
    const idSet = new Set(categoryTrackIds)
    return allTracks.filter((track) => idSet.has(track._id))
  }, [allTracks, categoryTrackIds])

  const processedTracks = useMemo(() => {
    if (!isLoading) return []

    let result = [...tracksToDisplay]

    // Фильтрация по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((track) => {
        return (
          track.name.toLowerCase().includes(query) ||
          track.author.toLowerCase().includes(query) ||
          track.album.toLowerCase().includes(query) ||
          (Array.isArray(track.genre) &&
            track.genre.some((g) => g.toLowerCase().includes(query)))
        )
      })
    }

    // Фильтрация по другим критериям (жанр, автор)
    result = result.filter((track) => {
      for (const [key, values] of Object.entries(selectedFilters)) {
        const filterKey = key as FiltersTagType
        if (filterKey === 'genre') {
          const trackGenres = Array.isArray(track.genre)
            ? track.genre
            : [track.genre]
          if (!values.some((v) => trackGenres.includes(v))) return false
        } else if (filterKey === 'author') {
          if (!values.includes(track.author)) return false
        }
      }
      return true
    })

    // Сортировка
    if (yearMode === 'new-first') {
      result.sort(
        (a, b) =>
          (parseInt(b.release_date, 10) || 0) -
          (parseInt(a.release_date, 10) || 0),
      )
    } else if (yearMode === 'old-first') {
      result.sort(
        (a, b) =>
          (parseInt(a.release_date, 10) || 0) -
          (parseInt(b.release_date, 10) || 0),
      )
    }

    return result
  }, [tracksToDisplay, searchQuery, selectedFilters, yearMode, isLoading])

  const handleTypeFilter = (filter: FiltersTagType) => {
    setTypeFilter((prev) => (prev === filter ? '' : filter))
  }

  const handleYearToggle = (mode: string) => {
    setYearMode(mode as 'default' | 'new-first' | 'old-first')
  }

  const onClickTrack = (track: Track) => {
    const isCurrentTrack = track._id === playTrack
    if (isCurrentTrack) {
      dispatch(setIsPlayTrack(!isPlayTrack))
    } else {
      dispatch(setCurrentTrack(track))
      dispatch(setIsPlayTrack(true))
    }
  }

  const handleToggleLike = async (
    trackId: number,
    e: React.MouseEvent,
    isLiked: boolean,
    track: Track,
  ) => {
    e.stopPropagation()

    if (!tokenAccess) {
      console.warn('⚠️ Попытка поставить лайк без авторизации')
      return
    }

    if (isLiked) {
      dispatch(removeTrackLocally(trackId))
    } else {
      dispatch(addTrackLocally(track))
    }

    try {
      if (isLiked) {
        await dispatch(removeTrackFromFavorites(trackId)).unwrap()
        console.log('✅ Трек удалён из избранного на сервере')
      } else {
        await dispatch(addTrackToFavorites(trackId)).unwrap()
        console.log('✅ Трек добавлен в избранное на сервере')
      }
    } catch (error) {
      console.error('❌ Ошибка при обновлении лайка:', error)

      if (isLiked) {
        dispatch(addTrackLocally(track))
      } else {
        dispatch(removeTrackLocally(trackId))
      }
    }
  }

  const skeletonTracks = Array(5).fill(null)

  const filters = [
    { label: 'исполнителю', value: 'author' as const },
    { label: 'году выпуска', value: 'release_date' as const },
    { label: 'жанру', value: 'genre' as const },
  ]

  return (
    <div className={styles.centerblock}>
      <Search
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <h2 className={styles.centerblock__h2}>
        {isLoading
          ? categoryName
            ? `${categoryName}`
            : 'Треки'
          : 'Загрузка...'}
      </h2>

      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>

        {filters.map((filter) => {
          const selectedCount =
            filter.value === 'release_date'
              ? yearMode !== 'default'
                ? 1
                : 0
              : selectedFilters[filter.value]?.length || 0

          return (
            <div
              className={styles.filter__wrapFilter__buttons}
              key={filter.value}
            >
              <div
                className={clsx(styles.filter__button_count, {
                  [styles.active_filtr]: selectedCount > 0,
                })}
              >
                {selectedCount}
              </div>

              <div
                onClick={() => handleTypeFilter(filter.value)}
                className={clsx(
                  styles.filter__button,
                  selectedCount > 0 && styles.filter__button_active,
                )}
              >
                {!isLoading ? <Skeleton width={80} /> : filter.label}
              </div>

              {typeFilter === filter.value && (
                <SortDropdown
                  typeFilter={filter.value}
                  selectedValues={
                    filter.value === 'release_date'
                      ? [yearMode]
                      : selectedFilters[filter.value] || []
                  }
                  onToggle={(value) => {
                    if (filter.value === 'release_date') {
                      handleYearToggle(value)
                    } else {
                      toggleFilter(filter.value, value)
                    }
                  }}
                  onClose={() => setTypeFilter('')}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={clsx(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={clsx(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={clsx(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={clsx(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch" />
            </svg>
          </div>
        </div>

        <div className={styles.content__playlist}>
          {!isLoading ? (
            skeletonTracks.map((_, index) => (
              <div key={index} className={styles.playlist__item}>
                <div className={styles.playlist__track}>
                  <div className={styles.track__title}>
                    <div className={styles.track__titleImage}>
                      <Skeleton
                        width={18}
                        height={18}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          borderRadius: '50%',
                        }}
                      />
                    </div>
                    <Skeleton width="80%" height={20} />
                  </div>
                  <div className={styles.track__author}>
                    <Skeleton width="80%" height={20} />
                  </div>
                  <div className={styles.track__album}>
                    <Skeleton width="60%" height={20} />
                  </div>
                  <div className={styles.track__time}>
                    <Skeleton
                      width={30}
                      height={12}
                      style={{ marginRight: 17 }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : processedTracks.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                {pathname === '/music/playlist'
                  ? 'Избранных треков нет'
                  : 'Ничего не найдено'}
              </p>
              {searchQuery && (
                <p className={styles.emptyStateSubtitle}>
                  по запросу "{searchQuery}"
                </p>
              )}
            </div>
          ) : (
            processedTracks.map((track) => {
              const isLiked = Array.isArray(favoriteTracks)
                ? favoriteTracks.some((t) => t._id === track._id)
                : false

              return (
                <div
                  key={track._id}
                  className={styles.playlist__item}
                  onClick={() => onClickTrack(track)}
                >
                  <div className={styles.playlist__track}>
                    <div className={styles.track__title}>
                      <div className={styles.track__titleImage}>
                        <svg
                          className={clsx(styles.track__titleSvg, {
                            [styles.active]:
                              track._id === playTrack && isPlayTrack,
                            [styles.selected__active]:
                              track._id === playTrack && !isPlayTrack,
                          })}
                          viewBox="0 0 20 19"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g className={styles.notePath}>
                            <path
                              d="M8 16V1.9697L19 1V13"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                            />
                            <ellipse
                              cx="4.5"
                              cy="16"
                              rx="3.5"
                              ry="2"
                              fill="none"
                              stroke="currentColor"
                            />
                            <ellipse
                              cx="15.5"
                              cy="13"
                              rx="3.5"
                              ry="2"
                              fill="none"
                              stroke="currentColor"
                            />
                          </g>
                          <path
                            className={styles.playPath}
                            d="M6 4.5 L14 9.5 L6 14.5 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <Link className={styles.track__titleLink} href="">
                        {track.name}
                      </Link>
                    </div>
                    <div className={styles.track__author}>
                      <Link className={styles.track__authorLink} href="">
                        {track.author}
                      </Link>
                    </div>
                    <div className={styles.track__album}>
                      <Link className={styles.track__albumLink} href="">
                        {track.album}
                      </Link>
                    </div>
                    <div className={styles.track__time}>
                      <span className={styles.track__timeText}>
                        {Math.floor(track.duration_in_seconds / 60)}:
                        {(track.duration_in_seconds % 60)
                          .toString()
                          .padStart(2, '0')}
                      </span>

                      {tokenAccess ? (
                        <svg
                          className={clsx(styles.track__likeSvg, {
                            [styles.liked]: isLiked,
                          })}
                          onClick={(e) =>
                            handleToggleLike(track._id, e, isLiked, track)
                          }
                          viewBox="0 0 16 14"
                          fill="none"
                        >
                          <use
                            xlinkHref={`/img/icon/sprite.svg#icon-like${isLiked ? '-filled' : ''}`}
                          />
                        </svg>
                      ) : (
                        <span className={styles.track__likePlaceholder} />
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
