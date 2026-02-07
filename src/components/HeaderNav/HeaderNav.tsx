'use client'

import Image from 'next/image'
import styles from './HeaderNav.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { resetFormData } from '@store/auth'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { clearFavorites } from '@store/catalog/slices/favoritesSlice'

export default function HeaderNav() {
  const [isOpenBurger, setIsOpenBurger] = useState(false)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()

  const router = useRouter()

  const toggleBurgerMenu = () => {
    setIsOpenBurger((prev) => !prev)
  }

  const handleLogout = () => {
    setIsOpenBurger(false)
    if (isLoggedIn) {
      dispatch(resetFormData())
      dispatch(clearFavorites())
      router.push('/music/main')
    } else {
      router.push('/auth/signin')
    }
  }

  const handleSelectionClick = () => {
    router.push('/music/main')
    toggleBurgerMenu()
  }

  const handleLinkClick = () => {
    setIsOpenBurger(false)
  }

  return (
    <nav className={styles.main__nav}>
      <Link href="/music/main">
        <div className={styles.nav__logo}>
          <Image
            width={250}
            height={170}
            className={styles.logo__image}
            src="/img/logo.png"
            alt="logo"
          />
        </div>
      </Link>
      <div
        onClick={toggleBurgerMenu}
        className={clsx(styles.nav__burger, {
          [styles.active]: isOpenBurger,
        })}
      >
        <span
          className={clsx(styles.burger__line, {
            [styles.burger__line1]: isOpenBurger,
          })}
        ></span>
        <span
          className={clsx(styles.burger__line, {
            [styles.burger__line2]: isOpenBurger,
          })}
        ></span>
        <span
          className={clsx(styles.burger__line, {
            [styles.burger__line3]: isOpenBurger,
          })}
        ></span>
      </div>

      <AnimatePresence>
        {isOpenBurger && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={styles.modal__block}
          >
            <ul className={styles.menu__list}>
              <li className={styles.menu__item}>
                <button
                  onClick={handleSelectionClick}
                  className={styles.menu__link_btn}
                >
                  Главное
                </button>
              </li>
              {isLoggedIn && (
                <li className={styles.menu__item}>
                  <Link
                    href="/music/playlist"
                    onClick={handleLinkClick}
                    className={styles.menu__link}
                  >
                    Мой плейлист
                  </Link>
                </li>
              )}
              <li className={styles.menu__item}>
                <button
                  onClick={handleLogout}
                  className={styles.menu__link_btn}
                >
                  {isLoggedIn ? 'Выйти' : 'Войти'}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
