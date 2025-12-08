import React, { ReactNode } from 'react'
import styles from './layout.module.css'
import clsx from 'clsx'
import Link from 'next/link'

type AuthLayoutProps = {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <Link style={{ color: 'black', background: 'white' }} href="/auth/signin">
        вход
      </Link>
      <Link style={{ color: 'black', background: 'white' }} href="/auth/signup">
        рег
      </Link>
      <div className={styles.wrapper}>
        <div className={styles.containerEnter}>
          <div className={styles.modal__block}>
            <form className={styles.modal__form}>{children}</form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthLayout
