'use client'

import Image from 'next/image'
import styles from './HeaderNav.module.css'
import Link from 'next/link'
import { useState } from 'react'
import clsx from 'clsx'

export default function HeaderNav() {
  const [isOpenBurger, setIsOpenBurger] = useState(false)

  const toggleBurgerMenu = () => {
    setIsOpenBurger((prev) => !prev)
  }

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt="logo"
        />
      </div>
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

      {isOpenBurger && (
        <div className={styles.nav__menu}>
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
        </div>
      )}
    </nav>
  )
}
