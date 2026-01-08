// src/components/Bar/Bar.tsx
'use client'

import clsx from 'clsx'
import styles from './Bar.module.css'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { setCurrentTrack, setIsPlayTrack, Track } from '@store/catalog'
import { formatTime } from '@utils/helpers'

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack)
  const isPlayTrack = useAppSelector((state) => state.tracks.isPlayTrack)
  const dispatch = useAppDispatch()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(50)
  const [isMute, setIsMute] = useState(false)
  const [isLoopTrack, setIsLoopTrack] = useState(false)
  const [isShuffleTrack, setIsShuffleTrack] = useState(false)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipTime, setTooltipTime] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState(0)

  const audio = audioRef.current
  const percentProgress = duration > 0 ? (currentTime / duration) * 100 : 0

  // === Управление аудио ===
  useEffect(() => {
    if (!audio || !currentTrack) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      if (!isLoopTrack) {
        onNextTrack()
      }
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audio, currentTrack, isLoopTrack, dispatch])

  // === Воспроизведение / пауза ===
  useEffect(() => {
    if (!audio || !currentTrack) return

    if (isPlayTrack) {
      audio.play().catch((err) => {
        console.warn('Ошибка воспроизведения:', err)
        dispatch(setIsPlayTrack(false))
      })
    } else {
      audio.pause()
    }
  }, [isPlayTrack, currentTrack, dispatch, audio])

  // === Громкость и Mute ===
  useEffect(() => {
    if (!audio) return
    audio.muted = isMute
    audio.volume = currentVolume / 100
  }, [isMute, currentVolume, audio])

  // === Обработчики UI ===
  const handlePlay = () => {
    if (currentTrack) {
      dispatch(setIsPlayTrack(!isPlayTrack))
    }
  }

  const toggleVolume = (value: number) => {
    setCurrentVolume(value)
  }

  const toggleMute = () => setIsMute((prev) => !prev)
  const toggleLooping = () => setIsLoopTrack((prev) => !prev)
  const toggleShuffle = () => setIsShuffleTrack((prev) => !prev)

  // === Навигация по трекам ===
  const getTrackList = (): Track[] => {
    // TODO: заменить на store.tracks.list, когда интегрируешь
    // Сейчас временно — из кэша или заглушка
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('tracks_cache')
        return cached ? JSON.parse(cached) : []
      } catch (e) {
        return []
      }
    }
    return []
  }

  const onNextTrack = () => {
    const tracks = getTrackList()
    if (!currentTrack || tracks.length === 0) return

    let nextIndex: number

    if (isShuffleTrack) {
      let currentIndex = tracks.findIndex((t) => t._id === currentTrack._id)
      if (currentIndex === -1) currentIndex = 0
      do {
        nextIndex = Math.floor(Math.random() * tracks.length)
      } while (nextIndex === currentIndex && tracks.length > 1)
    } else {
      const currentIndex = tracks.findIndex((t) => t._id === currentTrack._id)
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tracks.length
    }

    dispatch(setCurrentTrack(tracks[nextIndex]))
    dispatch(setIsPlayTrack(true))
  }

  const onPrevTrack = () => {
    const tracks = getTrackList()
    if (!currentTrack || tracks.length === 0) return

    const currentIndex = tracks.findIndex((t) => t._id === currentTrack._id)
    if (currentIndex === -1) return

    const prevIndex = isShuffleTrack
      ? Math.floor(Math.random() * tracks.length)
      : currentIndex === 0
      ? tracks.length - 1
      : currentIndex - 1

    dispatch(setCurrentTrack(tracks[prevIndex]))
    dispatch(setIsPlayTrack(true))
  }

  // === Прогресс-бар ===
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio || duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const clickPercent = Math.max(0, Math.min(1, offsetX / rect.width))
    const newTime = clickPercent * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, offsetX / rect.width))
    setTooltipPosition(percent * 100)
    setTooltipTime(percent * duration)
  }

  if (!currentTrack) return null

  // === Безопасные данные трека ===
  const trackAuthor =
    currentTrack.author === '-' ? 'Неизвестный' : currentTrack.author
  const trackAlbum =
    currentTrack.album === '-' ? 'Без альбома' : currentTrack.album

  return (
    <div className={styles.bar}>
      {/* Скрытый аудио-элемент */}
      <audio
        ref={audioRef}
        src={currentTrack.track_file}
        loop={isLoopTrack}
        style={{ display: 'none' }}
      />

      {/* Прогресс-бар (единый контейнер) */}
      <div
        className={styles.progressBarContainer}
        onClick={handleProgressClick}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onMouseMove={handleProgressMouseMove}
      >
        <div className={styles.progressBarBackground} />
        <div
          className={styles.progressBarFill}
          style={{ width: `${percentProgress}%` }}
        />
        {isTooltipVisible && (
          <div
            className={styles.progressBarTooltip}
            style={{ left: `${tooltipPosition}%` }}
          >
            {formatTime(tooltipTime)}
          </div>
        )}
      </div>

      {/* Панель управления */}
      <div className={styles.bar__playerBlock}>
        <div className={styles.bar__player}>
          <div className={styles.player__controls}>
            <div
              className={clsx(styles.player__btnPrev, {
                [styles.disable]: false, // можно добавить логику отключения
              })}
              onClick={onPrevTrack}
            >
              <svg className={styles.player__btnPrevSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-prev" />
              </svg>
            </div>

            <div className={styles.player__btnPlay} onClick={handlePlay}>
              {isPlayTrack ? (
                <svg className={styles.player__btnPlaySvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-pause" />
                </svg>
              ) : (
                <svg className={styles.player__btnPlaySvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-play" />
                </svg>
              )}
            </div>

            <div className={styles.player__btnNext} onClick={onNextTrack}>
              <svg className={styles.player__btnNextSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-next" />
              </svg>
            </div>

            <div
              className={clsx(styles.player__btnRepeat, styles.btnIcon, {
                [styles.active]: isLoopTrack,
              })}
              onClick={toggleLooping}
            >
              <svg className={styles.player__btnRepeatSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-repeat" />
              </svg>
            </div>

            <div
              className={clsx(styles.player__btnShuffle, styles.btnIcon, {
                [styles.active]: isShuffleTrack,
              })}
              onClick={toggleShuffle}
            >
              <svg className={styles.player__btnShuffleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-shuffle" />
              </svg>
            </div>
          </div>

          <div className={styles.player__trackPlay}>
            <div className={styles.trackPlay__contain}>
              <div className={styles.trackPlay__image_info}>
                <svg className={styles.trackPlay__svg_info}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                </svg>
              </div>
              <div className={styles.trackPlay__author}>
                <Link className={styles.trackPlay__authorLink} href="">
                  {trackAuthor}
                </Link>
              </div>
              <div className={styles.trackPlay__album}>
                <Link className={styles.trackPlay__albumLink} href="">
                  {trackAlbum}
                </Link>
              </div>
            </div>

            <div className={styles.trackPlay__dislike_wrap}>
              <div className={clsx(styles.trackPlay__like, styles.btnIcon)}>
                <svg className={styles.trackPlay__likeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                </svg>
              </div>
              <div className={clsx(styles.trackPlay__dislike, styles.btnIcon)}>
                <svg className={styles.trackPlay__dislikeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-dislike" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Громкость */}
        <div className={styles.bar__volumeBlock}>
          <div className={styles.volume__content}>
            <div
              className={clsx(styles.volume__image, { [styles.mute]: isMute })}
              onClick={toggleMute}
            >
              <svg className={styles.volume__svg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-volume" />
              </svg>
            </div>
            <div className={styles.volume__progress}>
              <input
                className={styles.volume__progressLine}
                type="range"
                min="0"
                max="100"
                value={currentVolume}
                onChange={(e) => toggleVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
