// src/components/Sidebar/Sidebar.tsx
'use client'

import Image from 'next/image'
import styles from './Sidebar.module.css'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { useEffect, useState } from 'react'
import { fetchAllSelections } from '@store/catalog/api/selectionThunk'
import { useRouter } from 'next/navigation'
import { resetFormData } from '@store/auth/slices/authSlice'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // ✅ ЛОКАЛЬНОЕ СОСТОЯНИЕ ДЛЯ ГИДРАТАЦИИ (начальное значение "Гость")
  const [userName, setUserName] = useState('Гость')

  // Получаем данные из Redux для обновления после гидратации
  const reduxUserName = useAppSelector((state) => state.auth.userData?.username)
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn)

  // Получаем подборки из Redux store
  const selections = useAppSelector((state) => state.selections.list)
  const selectionsLoading = useAppSelector((state) => state.selections.loading)

  // ✅ ОБНОВЛЯЕМ ИМЯ ТОЛЬКО НА КЛИЕНТЕ (после гидратации)
  useEffect(() => {
    if (reduxUserName && reduxUserName.trim() !== '') {
      setUserName(reduxUserName)
    } else {
      setUserName('Гость')
    }
  }, [reduxUserName])

  // Загружаем подборки при монтировании (если ещё не загружены)
  useEffect(() => {
    if (selections.length === 0 && !selectionsLoading) {
      dispatch(fetchAllSelections())
    }
  }, [dispatch, selections.length, selectionsLoading])

  // Обработка клика по подборке
  const handleSelectionClick = (_id: number) => {
    const selection = selections.find((s) => s._id === _id)
    if (selection) {
      router.push(`/music/category/${_id}`)
    } else {
      console.warn(`Подборка с _id=${_id} не найдена`)
    }
  }

  const handleLogout = () => {
    if (isLoggedIn) {
      dispatch(resetFormData())
      router.push('/music/main')
    } else {
      router.push('/auth/signin')
    }
  }

  // Определяем, какие подборки показывать в сайдбаре (системные: _id 2, 3, 4)
  const featuredIds = [2, 3, 4]
  const featuredSelections = selections
    .filter((s) => featuredIds.includes(s._id as number))
    .sort(
      (a, b) =>
        featuredIds.indexOf(a._id as number) -
        featuredIds.indexOf(b._id as number),
    )

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        {/* ✅ ТОЛЬКО ИМЯ ПОЛЬЗОВАТЕЛЯ (без лишних кнопок) */}
        <p className={styles.sidebar__personalName}>{userName}</p>
        <div onClick={handleLogout} className={styles.sidebar__icon}>
          <svg className={styles.sidebar__iconSvg}>
            <use xlinkHref="/img/icon/sprite.svg#logout" />
          </svg>
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
                    role="button"
                    aria-label={`Перейти в подборку ${selection.name}`}
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