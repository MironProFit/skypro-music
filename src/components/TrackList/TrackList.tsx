'use client'

import clsx from 'clsx'
import styles from './TrackList.module.css'
import Link from 'next/link'
import Search from '@components/Search/Search'
import { dataTrack } from 'src/data'
import SortDropdown from '@components/SortDropdown/SortDropdown'
import { useEffect, useState } from 'react'
import { TrackType } from 'src/sharedTypes/sharedTypes'

export default function TrackList() {
  const [typeFilter, setTypeFilter] = useState('')

  const handleTypeFilter = (filter: string) => {
    setTypeFilter(typeFilter === filter ? '' : filter)
  }

  const filters: { label: string; value: keyof TrackType }[] = [
    { label: 'исполнителю', value: 'author' },
    { label: 'году выпуска', value: 'release_date' },
    { label: 'жанру', value: 'genre' },
  ]

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

        {/* <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              handleTypeFilter('artist')
            }}
            className={styles.filter__button}
          >
            исполнителю
          </div>
          {typeFilter === 'artist' && <SortDropdown typeFilter={typeFilter} />}
        </div>

        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              handleTypeFilter('release_date')
            }}
            className={styles.filter__button}
          >
            году выпуска
          </div>
          <SortDropdown typeFilter={typeFilter} />
        </div>

        <div style={{ position: 'relative' }}>
          <div
            //   style={{ position: 'relative' }}
            onClick={() => {
              handleTypeFilter('genre')
            }}
            className={styles.filter__button}
          >
            жанру
          </div>
          <SortDropdown typeFilter={typeFilter} />
        </div> */}
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
            <div key={index} className={styles.playlist__item}>
              <div className={styles.playlist__track}>
                <div className={styles.track__title}>
                  <div className={styles.track__titleImage}>
                    <svg className={styles.track__titleSvg}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                    </svg>
                  </div>
                  <div className={styles.track__title_text}>
                    <Link className={styles.track__titleLink} href="">
                      {track.name}
                      {/* {track.span && (
                                                <span
                                                    className={
                                                        styles.track__titleSpan
                                                    }
                                                >
                                                    {track.span}
                                                </span>
                                            )} */}
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
