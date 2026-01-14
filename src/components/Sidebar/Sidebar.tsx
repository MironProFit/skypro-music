// src/components/Sidebar.tsx
'use client'

import Image from 'next/image'
import styles from './Sidebar.module.css'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { useEffect, useState } from 'react'
import { fetchAllSelections } from '@store/catalog/api/selectionThunk'
import { setCurrentSelection } from '@store/catalog/slices/selectionSlice'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const [userName, setUserName] = useState<string>('Гость')
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Получаем подборки из Redux store
  const selections = useAppSelector((state) => state.selections.list)
  const selectionsLoading = useAppSelector((state) => state.selections.loading)

  // Загружаем подборки при монтировании (если ещё не загружены)
  useEffect(() => {
    if (selections.length === 0 && !selectionsLoading) {
      dispatch(fetchAllSelections())
    }
  }, [dispatch, selections.length, selectionsLoading])

  // Загружаем имя пользователя
  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserName(user.username || 'Пользователь')
      } catch (e) {
        console.warn('Не удалось распарсить userData')
      }
    }
  }, [])

  // Обработка клика по подборке
  const handleSelectionClick = (_id: number) => {
    const selection = selections.find((s) => s._id === _id)
    if (selection) {
      console.log('Выбрана подборка:', selection)
      // Опционально: сохранить имя в Redux
      dispatch(setCurrentSelection(selection.name))
      // Перейти на страницу категории
      router.push(`/music/category/${_id}`)
    } else {
      console.warn(`Подборка с _id=${_id} не найдена`)
    }
  }

  // Определяем, какие подборки показывать в сайдбаре (системные: _id 2, 3, 4)
  const featuredIds = [2, 3, 4]
  const featuredSelections = selections
    .filter((s) => featuredIds.includes(s._id as number))
    .sort(
      (a, b) =>
        featuredIds.indexOf(a._id as number) -
        featuredIds.indexOf(b._id as number)
    )

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>{userName}</p>
        <div className={styles.sidebar__icon}>
          <Link href={'/auth/signin'}>
            <svg className={styles.sidebar__iconSvg}>
              <use xlinkHref="/img/icon/sprite.svg#logout" />
            </svg>
          </Link>
        </div>
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          {featuredSelections.length > 0
            ? featuredSelections.map((selection) => (
                <div key={selection._id} className={styles.sidebar__item}>
                  <div
                    className={styles.sidebar__link}
                    onClick={() => handleSelectionClick(selection._id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectionClick(selection._id)
                      }
                    }}
                  >
                    <Image
                      className={styles.sidebar__img}
                      src={`/img/selection${selection._id}.svg`}
                      alt={selection.name || 'Подборка'}
                      width={250}
                      height={150}
                      loading="eager"
                    />
                  </div>
                </div>
              ))
            : // Заглушки — просто 3 плейсхолдера
              [1, 2, 3].map((index) => (
                <div key={index} className={styles.sidebar__item}>
                  <div className={styles.sidebar__link}>
                    <div className={styles.sidebar__imgPlaceholder} />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
