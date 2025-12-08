'use client'

import clsx from 'clsx'
import styles from './Bar.module.css'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { setCurrentTrack, setIsPlayTrack } from 'src/store/features/trackSlise'
import { useEffect, useRef, useState } from 'react'
import { formatTime, getTimePanel } from '@utils/helpers'
import { TrackType } from 'src/sharedTypes/sharedTypes'
import { dataTrack } from 'src/data'
import { transform } from 'next/dist/build/swc/generated-native'

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.track.currentTrack)
  const isPlayTrack = useAppSelector((state) => state.track.isPlayTrack)
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
  const [isNoNextBtn, setIsNoNextBtn] = useState(false)
  const [isNoPrevBtn, setIsNoPrevBtn] = useState(false)
  const [currentTranslateX, setCurrentTranslateX] = useState<{
    left?: string
    right?: string
    transform?: string
  }>({})

  const audio = audioRef.current
  const parcentProcess = duration > 0 ? (currentTime / duration) * 100 : 0

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})

  // Новый useEffect для вычисления стилей tooltip'а
  useEffect(() => {
    if (!windowSize.width) return

    const TOOLTIP_WIDTH = 60 // ширина тултипа
    const cursorPosition = (parcentProcess / 100) * windowSize.width

    let newStyle: React.CSSProperties = {
      // по умолчанию - в центре
      left: `${parcentProcess}%`,
      transform: 'translateX(-50%)',
      right: 'auto',
    }

    if (cursorPosition < TOOLTIP_WIDTH) {
      // близко к левому краю
      newStyle = {
        left: '0px',
        transform: 'none',
        right: 'auto',
      }
    } else if (cursorPosition > windowSize.width - TOOLTIP_WIDTH) {
      // близко к правому краю
      newStyle = {
        right: '0px',
        transform: 'none',
        left: 'auto',
      }
    }

    setTooltipStyle(newStyle)
  }, [parcentProcess, windowSize.width])

  useEffect(() => {
    const handleSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleSize)
    handleSize()
    return () => window.removeEventListener('resize', handleSize)
  }, [])

  useEffect(() => {
    if (!audio) return
    const handleEnded = () => {
      onNextTrack()
    }
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audio])

  useEffect(() => {
    if (!isShuffleTrack) {
      const currentIndex = dataTrack.findIndex(
        (track: TrackType) => track._id === currentTrack?._id
      )
      // console.log(currentIndex)
      setIsNoNextBtn(currentIndex === dataTrack.length - 1)
    } else {
      setIsNoNextBtn(false)
    }
  }, [isNoNextBtn, isShuffleTrack, dataTrack, currentTrack])

  useEffect(() => {
    if (!isShuffleTrack) {
      const currentIndex = dataTrack.findIndex(
        (track) => track._id === currentTrack?._id
      )
      // console.log(currentIndex)

      setIsNoPrevBtn(currentIndex === 0 || currentIndex === -1)
    }
  }, [dataTrack, currentTrack])
  // Обработчик загрузки метаданных
  const onLoadedMetadata = () => {
    if (audio) {
      setDuration(audio.duration)
    }
  }

  // Функция handlePlay
  const handlePlay = () => {
    if (currentTrack) {
      if (isPlayTrack) {
        audio?.pause()
        dispatch(setIsPlayTrack(false))
      } else {
        dispatch(setIsPlayTrack(true))
      }
    }
  }

  // Эффект для запуска/остановки воспроизведения
  useEffect(() => {
    if (!audio || !currentTrack) return

    if (isPlayTrack) {
      ;(audio.play() as Promise<void>).catch((err) => {
        console.warn('Ошибка воспроизведения:', err)
        dispatch(setIsPlayTrack(false))
      })
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlayTrack, dispatch, audio])

  // Обновление прогресса
  useEffect(() => {
    if (!audio) return

    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
    }
  }, [audio])

  // Обновление mute
  useEffect(() => {
    if (audio) {
      audio.muted = isMute
    }
  }, [isMute, audio])

  // Обновление громкости
  const toggleVolume = (value: number) => {
    if (audio) {
      audio.volume = value / 100
      setCurrentVolume(value)
    }
  }

  // Обработка переключения mute
  const toggleMute = () => {
    setIsMute((prev) => !prev)
  }

  // Обработки прогресса (перемещение и клик)
  const handleProgressMouseEnter = () => setIsTooltipVisible(true)
  const handleProgressMouseLeave = () => setIsTooltipVisible(false)
  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const parcentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
    const timeAtPosition = (parcentage / 100) * duration
    setTooltipPosition(parcentage)
    setTooltipTime(timeAtPosition)
  }
  const onProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const parcentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
    const timeAtPosition = (parcentage / 100) * duration
    setTooltipPosition(parcentage)
    setTooltipTime(timeAtPosition)
    audio.currentTime = timeAtPosition
  }

  // Навигация по трекам
  const onNextTrack = () => {
    if (!currentTrack || !dataTrack || dataTrack.length === 0) return
    const currentIndex = !isShuffleTrack
      ? dataTrack.findIndex(
          (track: TrackType) => track._id === currentTrack._id
        )
      : (() => {
          let index
          const currentIndex = dataTrack.findIndex(
            (track: TrackType) => track._id === currentTrack._id
          )
          do {
            index = Math.floor(Math.random() * dataTrack.length)
          } while (index === currentIndex)
          return index
        })()

    const nextIndex = currentIndex < dataTrack.length - 1 ? currentIndex + 1 : 0

    const nextTrack = dataTrack[nextIndex]
    dispatch(setCurrentTrack(nextTrack))
    dispatch(setIsPlayTrack(true))
  }

  const onPrevTrack = () => {
    if (!currentTrack || !dataTrack || dataTrack.length === 0) return
    const currentIndex = dataTrack.findIndex(
      (track: TrackType) => track._id === currentTrack._id
    )

    const prevIndex = currentIndex - 1
    if (currentIndex === 0) return

    const prevTrack = dataTrack[prevIndex]
    dispatch(setCurrentTrack(prevTrack))
    dispatch(setIsPlayTrack(true))
  }

  // Обработки режимов
  const toggleLooping = () => {
    setIsLoopTrack(!isLoopTrack)
  }

  const toggleShuffle = () => {
    setIsShuffleTrack(!isShuffleTrack)
  }

  if (!currentTrack) return null

  return (
    <div
      className={styles.bar}
      onMouseLeave={handleProgressMouseLeave}
      onMouseEnter={handleProgressMouseEnter}
      onMouseMove={handleProgressMouseMove}
    >
      {/* Аудио элемент (скрыт) */}
      <audio
        style={{ display: 'none' }}
        ref={audioRef}
        src={currentTrack.track_file}
        loop={isLoopTrack}
        onLoadedMetadata={onLoadedMetadata}
      />

      {/* Прогресс бар */}
      <div className={styles.bar__progressOverlay}>
        <div
          className={styles.bar__progressFill}
          style={{ width: `${parcentProcess}%` }}
        />
      </div>

      {/* Тултип прогресс бара */}
      <div
        onClick={(e) => onProgressBarClick(e)}
        style={{ height: isTooltipVisible ? '20px' : '5px' }}
        className={clsx(styles.bar__playerProgress_wrap, {
          [styles.aiming]: isTooltipVisible,
        })}
      >
        <div
          className={clsx(styles.bar__playerProgressBacg, {
            [styles.aiming]: isTooltipVisible,
          })}
        ></div>
        <div>
          <div
            className={clsx(
              styles.bar__playerProgress_tooltip,
              styles.tooltip_current
            )}
            style={{
              visibility: isTooltipVisible ? 'visible' : 'hidden',
              // display: duration < 0 ? 'none' : 'flex',
              ...tooltipStyle,
            }}
          >
            {formatTime(currentTime)}
          </div>
          <div
            className={clsx(
              styles.bar__playerProgress_tooltip,
              styles.tooltip_duration
            )}
            style={{
              opacity: isTooltipVisible ? '1' : '0',
              display: duration < 0 ? 'none' : 'flex',
            }}
          >
            {formatTime(duration)}
          </div>
          <div
            className={clsx(styles.bar__playerProgress, {
              [styles.aiming]: isTooltipVisible,
            })}
            style={{ width: `${parcentProcess}%` }}
          ></div>
        </div>
      </div>

      {/* Контроль плеера */}
      <div className={styles.bar__playerBlock}>
        <div className={styles.bar__player}>
          {/* Управление: Prev, Play/Pause, Next, Repeat, Shuffle */}
          <div className={styles.player__controls}>
            <div
              className={clsx(styles.player__btnPrev, {
                [styles.disable]: isNoPrevBtn,
              })}
              style={{
                pointerEvents: isNoPrevBtn ? 'none' : 'auto',
              }}
              onClick={onPrevTrack}
              // onClick={() => console.log(isNoPrevBtn)}
            >
              <svg className={styles.player__btnPrevSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-prev" />
              </svg>
            </div>

            <div
              className={clsx(styles.player__btnPlay, styles.btn)}
              onClick={handlePlay}
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

            <div
              className={clsx(styles.player__btnNext, {
                [styles.disable]: isNoNextBtn,
              })}
              style={{
                pointerEvents: isNoNextBtn ? 'none' : 'auto',
              }}
              onClick={onNextTrack}
            >
              <svg className={styles.player__btnNextSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-next" />
              </svg>
            </div>

            {/* Повтор */}
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

            {/* Рандом */}
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

          {/* Информация о текущем треке */}
          <div className={styles.player__trackPlay}>
            <div className={styles.trackPlay__contain}>
              <div className={styles.trackPlay__image_info}>
                <svg className={styles.trackPlay__svg_info}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                </svg>
              </div>
              <div className={styles.trackPlay__author}>
                <Link className={styles.trackPlay__authorLink} href="">
                  {currentTrack.author === '-'
                    ? 'Неизвестный'
                    : currentTrack.author}
                </Link>
              </div>
              <div className={styles.trackPlay__album}>
                <Link className={styles.trackPlay__albumLink} href="">
                  {currentTrack.album === '-'
                    ? 'Без альбома'
                    : currentTrack.album}
                </Link>
              </div>
            </div>

            {/* Лайки / Дизлайки */}
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

        {/* Управление громкостью */}
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
                step="1"
                value={currentVolume}
                onChange={(e) => {
                  toggleVolume(Number(e.target.value))
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
