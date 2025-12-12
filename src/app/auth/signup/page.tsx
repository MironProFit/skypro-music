'use client'

import styles from './signup.module.css'
import Link from 'next/link'
import clsx from 'clsx'
import { useParams } from 'next/navigation'

import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function SignUpPage() {
  const { formData, handleChange, handleSubmit } = useAuth()

  // type RouteParams = { id?: string }

  // const params = useParams() as RouteParams

  // useEffect(() => {
  //   console.log('Params:', params)
  // }, [params])

  return (
    <form onSubmit={handleSubmit} className={styles.modal__form}>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </div>
      </Link>
      <input
        className={clsx(styles.modal__input, styles.login)}
        type="text"
        name="email"
        placeholder="Почта"
        onChange={handleChange}
        value={formData.email}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={handleChange}
        value={formData.password}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="passwordConfirm"
        placeholder="Повторите пароль"
        onChange={handleChange}
        value={formData.passwordConfirm}
      />
      <div className={styles.errorContainer}></div>
      <button type={'submit'} className={styles.modal__btnSignupEnt}>
        Зарегистрироваться
      </button>
    </form>
  )
}
