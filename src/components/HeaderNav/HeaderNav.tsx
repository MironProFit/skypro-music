'use client'

import Image from 'next/image'
import styles from './HeaderNav.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeaderNav() {
  const [isOpenBurger, setIsOpenBurger] = useState(false)

  const toggleBurgerMenu = () => {
    setIsOpenBurger((prev) => !prev)
  }


  return (
    <nav className={styles.main__nav}>
      <Link href="/">
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
                <Link href="#" className={styles.menu__link}>
                  Главное
                </Link>
              </li>
              <li className={styles.menu__item}>
                <Link href="#" className={styles.menu__link}>
                  Мой плейлист
                </Link>
              </li>
              <li className={styles.menu__item}>
                <Link href="../signin.html" className={styles.menu__link}>
                  Войти
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
