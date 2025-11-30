'use client'

import clsx from 'clsx'
import styles from './TrackList.module.css'
import Link from 'next/link'
import Search from '@components/Search/Search'
import { dataTrack } from 'src/data'
import SortDropdown from '@components/SortDropdown/SortDropdown'
import { useState } from 'react'
import { FiltersTagType, TrackType } from 'src/sharedTypes/sharedTypes'
import { setCurrentTrack, setIsPlayTrack } from 'src/store/features/trackSlise'
import { useAppDispatch, useAppSelector } from 'src/store/store'

export default function TrackList() {
  const [typeFilter, setTypeFilter] = useState('')
  const playTrack = useAppSelector((state) => state.track.currentTrack?._id)
  const isPlayTrack = useAppSelector((state) => state.track.isPlayTrack)

  const handleTypeFilter = (filter: string) => {
    setTypeFilter(typeFilter === filter ? '' : filter)
  }

  const filters: {
    label: string
    value: FiltersTagType
  }[] = [
    { label: 'исполнителю', value: 'author' },
    { label: 'году выпуска', value: 'release_date' },
    { label: 'жанру', value: 'genre' },
  ]

  const dispatch = useAppDispatch()

  const onClickTrack = (track: TrackType) => {
    dispatch(setCurrentTrack(track))
    dispatch(setIsPlayTrack(true))
  }

  return (
    <div className={styles.centerblock}>
      <Search />

      <h2 className={styles.centerblock__h2}>Треки</h2>
      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>

        {filters.map((filter) => (
          <div
            className={styles.filter__wrapFilter__buttons}
            key={filter.label}
          >
            <div
              onClick={() => {
                handleTypeFilter(filter.value)
              }}
              className={clsx(
                styles.filter__button,
                typeFilter === filter.value && styles.filter__button_active
              )}
            >
              {filter.label}
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
          {dataTrack.map((track, index) => (
            <div
              key={index}
              className={styles.playlist__item}
              onClick={() => onClickTrack(track)}
            >
              <div className={styles.playlist__track}>
                <div className={styles.track__title}>
                  {/* === Обновлённая иконка с анимацией === */}
                  <div className={styles.track__titleImage}>
                    <svg
                      className={clsx(
                        styles.track__titleSvg,
                        {
                          [styles.active]:
                            track._id === playTrack && isPlayTrack,
                        },
                        {
                          [styles.selected__active]:
                            track._id === playTrack && !isPlayTrack,
                        }
                      )}
                      viewBox="0 0 20 19"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Нота — видна по умолчанию */}
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

                      {/* Плей — появляется при .active */}
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
                  {/* === Конец иконки === */}

                  <div className={styles.track__title_text}>
                    <Link className={styles.track__titleLink} href="">
                      {track.name}
                    </Link>
                  </div>
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
