'use client'

import Image from 'next/image'
import styles from './Sidebar.module.css'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const [userName, setuserName] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    const userName = localStorage.getItem('userData')
    if (userName) {
      const user = JSON.parse(userName)
      const name = user.username
      setuserName(name)
    }
    if (!userName) {
      setuserName('Гость')
    }
  }, [])

  const handleSelectionClick = (id: number) => {
    
  }

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
          {[1, 2, 3].map((id) => (
            <div key={id} className={styles.sidebar__item}>
              <div
                className={styles.sidebar__link}
                // href={`/music/category/${id}`}
                onClick={() => handleSelectionClick(id)}
              >
                <Image
                  className={styles.sidebar__img}
                  src={`/img/selection${id}.svg`}
                  alt="day's playlist"
                  width={250}
                  height={150}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
