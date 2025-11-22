'use client'

import Image from 'next/image'
import styles from './HeaderNav.module.css'
import Link from 'next/link'
import { useState } from 'react'

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
                className={`${styles.nav__burger} ${
                    isOpenBurger ? styles.active : ''
                }`}
            >
                <span
                    className={`${styles.burger__line} ${
                        isOpenBurger ? styles.burger__line1 : ''
                    }`}
                ></span>
                <span
                    className={`${styles.burger__line} ${
                        isOpenBurger ? styles.burger__line2 : ''
                    }`}
                ></span>
                <span
                    className={`${styles.burger__line} ${
                        isOpenBurger ? styles.burger__line3 : ''
                    }`}
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
                            <Link
                                href="../signin.html"
                                className={styles.menu__link}
                            >
                                Войти
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    )
}
