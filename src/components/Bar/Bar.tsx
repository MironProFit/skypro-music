'use client'

import clsx from 'clsx'
import styles from './Bar.module.css'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@utils/helpers'
import {
  setCurrentTrack,
  setIsPlayTrack,
} from '@store/catalog/slices/tracksSlice'
import { useToggleLike } from 'src/hooks/useToggleLike'
import { Track } from '@store/catalog/model/types'

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack)
  const isPlayTrack = useAppSelector((state) => state.tracks.isPlayTrack)
  const favoriteTracks = useAppSelector(
    (state) => state.favorites.favoriteTracks,
  )
  const dispatch = useAppDispatch()

  const { toggleLike, tokenAccess } = useToggleLike()

  const isCurrentTrackLiked = currentTrack
    ? Array.isArray(favoriteTracks) &&
      favoriteTracks.some((t) => t._id === currentTrack._id)
    : false

  useEffect(() => {
    console.log('isCurrentTrackLiked', isCurrentTrackLiked)
  }, [currentTrack])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const duration = currentTrack?.duration_in_seconds ?? 0
  const percentProgress = duration > 0 ? (currentTime / duration) * 100 : 0

  const [currentVolume, setCurrentVolume] = useState(50)
  const [isMute, setIsMute] = useState(false)
  const [isLoopTrack, setIsLoopTrack] = useState(false)
  const [isShuffleTrack, setIsShuffleTrack] = useState(false)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipTime, setTooltipTime] = useState(0)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })
  const listTracks = useAppSelector((state) => state.tracks.list)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [tooltipPosition, setTooltipPosition] = useState(0)

  useEffect(() => {
    if (currentTrack) {
      setCurrentTime(0)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    }
  }, [currentTrack?._id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isPlayTrack) return

    let isMounted = true

    const updateTime = () => {
      if (isMounted && audio.currentTime !== currentTime) {
        setCurrentTime(audio.currentTime)
      }
    }

    const fallbackInterval = setInterval(() => {
      if (isMounted && audio.currentTime !== currentTime) {
        setCurrentTime(audio.currentTime)
      }
    }, 200)

    audio.addEventListener('timeupdate', updateTime)

    const handleCanPlay = () => {
      if (isMounted && audio.currentTime === 0 && currentTime === 0) {
        setCurrentTime(0.1)
      }
    }
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      isMounted = false
      clearInterval(fallbackInterval)
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [isPlayTrack, currentTrack?._id])

  useEffect(() => {
    if (currentTrack) {
      setCurrentTime(0)
      if (audioRef.current) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0
          }
        }, 50)
      }
    }
  }, [currentTrack?._id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlayTrack) {
      const playPromise = audio.play()
      if (playPromise) {
        playPromise.catch((err) => {
          console.warn('[WARN] Play failed:', err)
          dispatch(setIsPlayTrack(false))
        })
      }
    } else {
      audio.pause()
    }
  }, [currentTrack?._id, isPlayTrack, dispatch])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => onNextTrack()
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [isShuffleTrack, currentTrack?._id, listTracks])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.muted = isMute
  }, [isMute])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = currentVolume / 100
  }, [currentVolume])

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!windowSize.width || !duration) return

    const TOOLTIP_WIDTH = 60
    const cursorPosition = (percentProgress / 100) * windowSize.width

    let newStyle: React.CSSProperties = {
      left: `${percentProgress}%`,
      transform: 'translateX(-50%)',
      right: 'auto',
    }

    if (cursorPosition < TOOLTIP_WIDTH) {
      newStyle = { left: '0px', transform: 'none', right: 'auto' }
    } else if (cursorPosition > windowSize.width - TOOLTIP_WIDTH) {
      newStyle = { right: '0px', transform: 'none', left: 'auto' }
    }

    setTooltipStyle(newStyle)
  }, [percentProgress, windowSize.width, duration])

  const findTrackIndex = () =>
    listTracks.findIndex((track) => track._id === currentTrack?._id)

  const onNextTrack = () => {
    if (!currentTrack || listTracks.length === 0) return

    let nextIndex: number
    if (isShuffleTrack) {
      const currentIndex = findTrackIndex()
      let newIndex: number
      do {
        newIndex = Math.floor(Math.random() * listTracks.length)
      } while (newIndex === currentIndex && listTracks.length > 1)
      nextIndex = newIndex
    } else {
      const currentIndex = findTrackIndex()
      nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % listTracks.length
    }

    const nextTrack = listTracks[nextIndex]
    dispatch(setCurrentTrack(nextTrack))
    dispatch(setIsPlayTrack(true))
  }

  const onPrevTrack = () => {
    if (!currentTrack || listTracks.length === 0) return
    const currentIndex = findTrackIndex()
    if (currentIndex <= 0) return
    const prevTrack = listTracks[currentIndex - 1]
    dispatch(setCurrentTrack(prevTrack))
    dispatch(setIsPlayTrack(true))
  }

  const handlePlay = () => {
    if (currentTrack) {
      dispatch(setIsPlayTrack(!isPlayTrack))
    }
  }

  const toggleMute = () => setIsMute((prev) => !prev)
  const toggleLooping = () => setIsLoopTrack((prev) => !prev)
  const toggleShuffle = () => setIsShuffleTrack((prev) => !prev)

  const toggleVolume = (value: number) => {
    setCurrentVolume(value)
  }

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
    const timeAtPosition = (percentage / 100) * duration
    setTooltipPosition(percentage)
    setTooltipTime(timeAtPosition)
  }

  const onProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
    const timeAtPosition = (percentage / 100) * duration

    audio.currentTime = timeAtPosition
    setCurrentTime(timeAtPosition)
  }

  const currentIndex = findTrackIndex()
  const isNoPrevBtn = currentIndex <= 0
  const isNoNextBtn = !isShuffleTrack && currentIndex >= listTracks.length - 1

  const handleCurrentTrackLike = async () => {
    if (!currentTrack) return
    await toggleLike(currentTrack._id, isCurrentTrackLiked, currentTrack)
  }

  if (!currentTrack) return null

  return (
    <div
      className={styles.bar}
      onMouseLeave={() => setIsTooltipVisible(false)}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseMove={handleProgressMouseMove}
    >
      <audio
        ref={audioRef}
        src={currentTrack.track_file}
        loop={isLoopTrack}
        style={{ display: 'none' }}
      />

      <div className={styles.bar__progressOverlay}>
        <div
          className={styles.bar__progressFill}
          style={{ width: `${percentProgress}%` }}
        />
      </div>

      <div
        onClick={onProgressBarClick}
        className={clsx(styles.bar__playerProgress_wrap, {
          [styles.aiming]: isTooltipVisible,
        })}
        style={{ height: isTooltipVisible ? '20px' : '5px' }}
      >
        <div
          className={clsx(styles.bar__playerProgressBacg, {
            [styles.aiming]: isTooltipVisible,
          })}
        />
        <div>
          <div
            className={clsx(
              styles.bar__playerProgress_tooltip,
              styles.tooltip_current,
            )}
            style={{
              visibility: isTooltipVisible ? 'visible' : 'hidden',
              ...tooltipStyle,
            }}
          >
            {formatTime(currentTime)}
          </div>

          <div
            className={clsx(
              styles.bar__playerProgress_tooltip,
              styles.tooltip_duration,
            )}
            style={{
              opacity: isTooltipVisible ? 1 : 0,
              display: duration > 0 ? 'flex' : 'none',
            }}
          >
            {formatTime(duration)}
          </div>

          <div
            className={clsx(styles.bar__playerProgress, {
              [styles.aiming]: isTooltipVisible,
            })}
            style={{ width: `${percentProgress}%` }}
          />
        </div>
      </div>

      <div className={styles.bar__playerBlock}>
        <div className={styles.bar__player}>
          <div className={styles.player__controls}>
            <div
              className={clsx(styles.player__btnPrev, {
                [styles.disable]: isNoPrevBtn,
              })}
              style={{ pointerEvents: isNoPrevBtn ? 'none' : 'auto' }}
              onClick={onPrevTrack}
            >
              <svg className={styles.player__btnPrevSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-prev" />
              </svg>
            </div>

            <div
              className={clsx(styles.player__btnPlay, styles.btn)}
              onClick={handlePlay}
            >
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

            <div
              className={clsx(styles.player__btnNext, {
                [styles.disable]: isNoNextBtn,
              })}
              style={{ pointerEvents: isNoNextBtn ? 'none' : 'auto' }}
              onClick={onNextTrack}
            >
              <svg className={styles.player__btnNextSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-next" />
              </svg>
            </div>

            <div
              onClick={toggleLooping}
              className={clsx(styles.player__btnRepeat, styles.btnIcon)}
            >
              <svg
                className={clsx(styles.player__btnRepeatSvg, {
                  [styles.active]: isLoopTrack,
                })}
              >
                <use xlinkHref="/img/icon/sprite.svg#icon-repeat" />
              </svg>
            </div>

            <div
              className={clsx(styles.player__btnShuffle, styles.btnIcon)}
              onClick={toggleShuffle}
            >
              <svg
                className={clsx(styles.player__btnShuffleSvg, {
                  [styles.active]: isShuffleTrack,
                })}
              >
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
                <Link className={styles.trackPlay__authorLink} href="#">
                  {currentTrack.author === '-'
                    ? 'Неизвестный'
                    : currentTrack.author}
                </Link>
              </div>
              <div className={styles.trackPlay__album}>
                <Link className={styles.trackPlay__albumLink} href="#">
                  {currentTrack.album === '-'
                    ? 'Без альбома'
                    : currentTrack.album}
                </Link>
              </div>
            </div>

            <div className={styles.trackPlay__like_wrap}>
              {tokenAccess && (
                <div
                  className={clsx(styles.trackPlay__like, styles.btnIcon)}
                  onClick={handleCurrentTrackLike}
                  style={{ cursor: 'pointer' }}
                >
                  <svg
                    className={clsx(styles.trackPlay__likeSvg, {
                      [styles.liked]: isCurrentTrackLiked,
                    })}
                  >
                    <use
                      xlinkHref={`/img/icon/sprite.svg#icon-like${isCurrentTrackLiked ? '-filled' : ''}`}
                      color={isCurrentTrackLiked ? '#b672ff' : '#d9d9d9'}
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bar__volumeBlock}>
          <div className={styles.volume__content}>
            <div
              className={clsx(styles.volume__image, {
                [styles.mute]: isMute,
              })}
              onClick={toggleMute}
            >
              <svg className={styles.volume__svg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-volume" />
              </svg>
            </div>
            <div className={clsx(styles.volume__progress, styles.btn)}>
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
