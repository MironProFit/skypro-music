'use client'

import styles from './signin.module.css'
import classNames from 'classnames'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { resetFormData } from 'src/store/features/auth/authSlice'
import clsx from 'clsx'
import { loginUser } from '@store/auth/thunks/loginUser.thunk'
import { useEffect } from 'react'

export default function SigninPage() {
  const { handleChange, formData, errors, setErrors } = useAuth()
  const dispatch = useAppDispatch()
  const errorMes = useAppSelector((state) => state.auth.error)
  const isDisabled =
    !!errors.email || !!errors.password || !formData.email || !formData.password

  // useEffect(() => {
  //   console.log(formData)
  // }, [formData])

  useEffect(() => {
    dispatch(resetFormData())
    setErrors({ email: '', password: '' })
  }, [dispatch, setErrors])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Обработка формы
    // console.log(typeof formData.email)
    dispatch(loginUser({ email: formData.email, password: formData.password }))
    // console.log('Form submitted:', formData)
  }

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
      <div className={styles.warning}>{errorMes}</div>

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
