'use client'

import styles from './signin.module.css'
import classNames from 'classnames'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useAppDispatch } from 'src/store/store'
import { useEffect } from 'react'
import { resetFormData } from 'src/store/features/authSlice'
import clsx from 'clsx'

export default function SigninPage() {
  const { handleSubmit, handleChange, formData, errors, setErrors } = useAuth()
  const dispatch = useAppDispatch()
  const isDisabled =
    !!errors.email || !!errors.password || !formData.email || !formData.password

  useEffect(() => {
    dispatch(resetFormData())
    setErrors({ email: '', password: '' })
  }, [dispatch, setErrors])

  return (
    <form onSubmit={handleSubmit} className={styles.modal__form}>
      {/* Логотип */}
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </div>
      </Link>

      {/* Поле Email */}
      <input
        className={classNames(styles.modal__input, styles.marginBottom30)}
        type="text"
        name="email"
        placeholder="Почта"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <div
        className={clsx(styles.errorContainer, {
          [styles.active]: !!errors.email,
        })}
      >
        {errors.email}
      </div>

      {/* Поле Пароль */}
      <input
        className={classNames(styles.modal__input, styles.marginBottom30)}
        type="password"
        name="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <div
        className={clsx(styles.errorContainer, {
          [styles.active]: !!errors.password,
        })}
      >
        {errors.password}
      </div>

      {/* Кнопка Войти */}
      <button
        disabled={isDisabled}
        type="submit"
        className={styles.modal__btnEnter}
      >
        Войти
      </button>

      {/* Ссылка на регистрацию */}
      <Link href="/auth/signup" className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </form>
  )
}
