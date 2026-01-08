// src/components/TrackList/TrackList.tsx

'use client'

import clsx from 'clsx'
import styles from './TrackList.module.css'
import Link from 'next/link'
import Search from '@components/Search/Search'
import { dataTrack } from 'src/data'
import SortDropdown from '@components/SortDropdown/SortDropdown'
import { useEffect, useState } from 'react'
import { FiltersTagType } from 'src/sharedTypes/sharedTypes'
import { Track } from '@store/catalog'
import {
  setCurrentTrack,
  setIsPlayTrack,
} from '@store/catalog/slices/tracksSliсe'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import Skeleton from '@components/Skeleton/Skeleton'

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
  const loadingList = useAppSelector((state) => state.auth.isLoadingTrackList)
  const listTracks = useAppSelector((state) => state.tracks.list)

  // Исправлено: принимаем FiltersTagType, а не string
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
        {!loadingList
          ? categoryId
            ? `Треки по категории: ${categoryId}`
            : 'Треки'
          : 'Загрузка...'}
      </h2>

      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>

        {filters.map((filter) => (
          <div
            className={styles.filter__wrapFilter__buttons}
            key={filter.value}
          >
            <div
              onClick={() => handleTypeFilter(filter.value)}
              className={clsx(
                styles.filter__button,
                typeFilter === filter.value && styles.filter__button_active
              )}
            >
              {loadingList ? <Skeleton width={80} /> : filter.label}
            </div>
            {typeFilter === filter.value && (
              <SortDropdown typeFilter={filter.value} />
            )}
          </div>
        ))}
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
          {loadingList
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
            : Array.isArray(listTracks) &&
              listTracks.map(
                (track, index) => (
                  (
                    <div
                      key={index}
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
                  )
                )
              )}
        </div>
      </div>
    </div>
  )
}
