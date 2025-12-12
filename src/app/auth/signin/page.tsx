'use client'

import styles from './signin.module.css'
import classNames from 'classnames'
import Link from 'next/link'
import AuthLayout from '../layout'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function SigninPage() {
  const params = useParams()
  useEffect(() => {
    console.log(params)
  }, [params])

  return (
    <AuthLayout>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </div>
      </Link>
      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="login"
        placeholder="Почта"
      />
      <input
        className={classNames(styles.modal__input)}
        type="password"
        name="password"
        placeholder="Пароль"
      />
      <div className={styles.errorContainer}>{/*Блок для ошибок*/}</div>
      <button className={styles.modal__btnEnter}>Войти</button>
      <Link href="/auth/signup" className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </AuthLayout>
  )
}
