'use client'

import clsx from 'clsx'
import styles from './Bar.module.css'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { setIsPlayTrack } from 'src/store/features/trackSlise'
import { useRef } from 'react'

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.track.currentTrack)
  const isPlayTrack = useAppSelector((state) => state.track.isPlayTrack)
  const dispatch = useAppDispatch()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    if (currentTrack) {
      const audio = audioRef.current
      if (isPlayTrack) {
        audio?.pause()
      } else {
        audio?.play()
      }
      dispatch(setIsPlayTrack(!isPlayTrack))
    }
  }

  return (
    <div className={styles.bar}>
      <audio
        style={{ display: 'none' }}
        ref={audioRef}
        src={currentTrack?.track_file}
      />

      <div className={styles.bar__content}>
        <div className={styles.bar__playerProgress}></div>

        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev" />
                </svg>
              </div>

              <div
                className={clsx(styles.player__btnPlay, styles.btn, {
                  [styles.active]: !currentTrack,
                })}
                onClick={togglePlay}
              >
                {!isPlayTrack ? (
                  <svg className={styles.player__btnPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-play" />
                  </svg>
                ) : (
                  <svg className={styles.player__btnPlaySvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-pause" />
                  </svg>
                )}
              </div>

              <div className={styles.player__btnNext}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next" />
                </svg>
              </div>

              <div className={clsx(styles.player__btnRepeat, styles.btnIcon)}>
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat" />
                </svg>
              </div>

              <div className={clsx(styles.player__btnShuffle, styles.btnIcon)}>
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle" />
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    Ты та...
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    Баста
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div className={clsx(styles.trackPlay__like, styles.btnIcon)}>
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                  </svg>
                </div>
                <div
                  className={clsx(styles.trackPlay__dislike, styles.btnIcon)}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume" />
                </svg>
              </div>
              <div className={clsx(styles.volume__progress, styles.btn)}>
                <input
                  className={styles.volume__progressLine}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
