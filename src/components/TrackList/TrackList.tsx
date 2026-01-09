'use client'

import clsx from 'clsx'
import styles from './TrackList.module.css'
import Link from 'next/link'
import Search from '@components/Search/Search'
import SortDropdown from '@components/SortDropdown/SortDropdown'
import { useEffect, useMemo, useState } from 'react'
import { FiltersTagType } from 'src/sharedTypes/sharedTypes'
import { Track } from '@store/catalog'
import {
  setCurrentTrack,
  setIsPlayTrack,
} from '@store/catalog/slices/tracksSliсe'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import Skeleton from '@components/Skeleton/Skeleton'
import { useFilters } from 'src/hooks/useSelectedFilter'

type TrackListProps = {
  categoryId?: string | null
  categoryTracks?: Track[] | null
}

type FilterState = '' | FiltersTagType

export default function TrackList({
  categoryId,
  categoryTracks,
}: TrackListProps) {
  const [typeFilter, setTypeFilter] = useState<FilterState>('')
  const playTrack = useAppSelector((state) => state.tracks.currentTrack?._id)
  const isPlayTrack = useAppSelector((state) => state.tracks.isPlayTrack)
  const listTracks = useAppSelector((state) => state.tracks.list)

  const { filters: selectedFilters, toggleFilter } = useFilters()

  const isLoadingTrackList = Array.isArray(listTracks)

  // Подсчёт количества треков с заполненным полем для каждого типа фильтра
  const allCountsByType = useMemo(() => {
    if (!isLoadingTrackList) {
      return { author: 0, release_date: 0, genre: 0 }
    }

    const counts = {
      author: 0,
      release_date: 0,
      genre: 0,
    } as Record<FiltersTagType, number>

    for (const track of listTracks) {
      if (track.author && track.author !== '-') counts.author++
      if (track.release_date && track.release_date !== '-')
        counts.release_date++
      if (track.genre) {
        const genres = Array.isArray(track.genre) ? track.genre : [track.genre]
        if (genres.some((g) => g && g !== '-')) counts.genre++
      }
    }

    return counts
  }, [listTracks, isLoadingTrackList])

  // Фильтрация треков по выбранным значениям
  const filteredTracks = useMemo(() => {
    if (!isLoadingTrackList) return []

    return listTracks.filter((track) => {
      for (const [key, values] of Object.entries(selectedFilters)) {
        const filterKey = key as FiltersTagType
        if (filterKey === 'genre') {
          const trackGenres = Array.isArray(track.genre)
            ? track.genre
            : [track.genre]
          if (!values.some((v) => trackGenres.includes(v))) {
            return false
          }
        } else {
          if (!values.includes(track[filterKey])) {
            return false
          }
        }
      }
      return true
    })
  }, [listTracks, selectedFilters, isLoadingTrackList])

  const handleTypeFilter = (filter: FiltersTagType) => {
    setTypeFilter((prev) => (prev === filter ? '' : filter))
  }

  const filters = [
    { label: 'исполнителю', value: 'author' as const },
    { label: 'году выпуска', value: 'release_date' as const },
    { label: 'жанру', value: 'genre' as const },
  ]

  const dispatch = useAppDispatch()

  const onClickTrack = (track: Track) => {
    const isCurrentTrack = track._id === playTrack
    if (isCurrentTrack) {
      dispatch(setIsPlayTrack(!isPlayTrack))
    } else {
      dispatch(setCurrentTrack(track))
      dispatch(setIsPlayTrack(true))
    }
  }

  const skeletonTracks = Array(5).fill(null)

  return (
    <div className={styles.centerblock}>
      <Search />

      <h2 className={styles.centerblock__h2}>
        {isLoadingTrackList
          ? categoryId
            ? `Треки по категории: ${categoryId}`
            : 'Треки'
          : 'Загрузка...'}
      </h2>

      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>

        {filters.map((filter) => {
          const selectedCount = selectedFilters[filter.value]?.length || 0

          return (
            <div
              className={styles.filter__wrapFilter__buttons}
              key={filter.value}
            >
              {/* Кружок только если выбрано хотя бы одно значение */}
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
                  selectedCount > 0 && styles.filter__button_active
                )}
              >
                {!isLoadingTrackList ? <Skeleton width={80} /> : filter.label}
              </div>

              {typeFilter === filter.value && (
                <SortDropdown
                  typeFilter={filter.value}
                  selectedValues={selectedFilters[filter.value] || []}
                  onToggle={(value) => toggleFilter(filter.value, value)}
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
          {!isLoadingTrackList
            ? skeletonTracks.map((_, index) => (
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
            : filteredTracks.map((track) => (
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
                      <svg className={styles.track__timeSvg}>
                        <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                      </svg>
                      <span className={styles.track__timeText}>
                        {track.duration_in_seconds}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
