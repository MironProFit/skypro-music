'use client'

import styles from './signin.module.css'
import classNames from 'classnames'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@components/Loading/Loading'
import { getUserToken, loginUser, resetFormData } from '@store/auth'
import { toast } from 'react-toastify'
import { clearError } from '@store/auth/slices/authSlice'

export default function SigninPage() {
  const { handleChange, formData, errors, setErrors } = useAuth()
  const dispatch = useAppDispatch()
  const errorMes = useAppSelector((state) => state.auth.error)
  const isDisabled =
    !!errors.email || !!errors.password || !formData.email || !formData.password

  const [toastShown, setToastShown] = useState(false)
  const prevErrorRef = useRef<string | null>(null)

  useEffect(() => {
    dispatch(resetFormData())
    setErrors({ email: '', password: '' })
    setToastShown(false)
    prevErrorRef.current = null
  }, [dispatch, setErrors])

  useEffect(() => {
    if (errorMes && errorMes !== prevErrorRef.current && !toastShown) {
      toast.error(errorMes, {
        autoClose: 5000,
        onClose: () => {
          dispatch(clearError())
        },
      })
      prevErrorRef.current = errorMes
      setToastShown(true)
      const timer = setTimeout(() => {
        setToastShown(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
    if (!errorMes && toastShown) {
      setToastShown(false)
      prevErrorRef.current = null
    }
  }, [errorMes, toastShown, dispatch])

  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setToastShown(false)
    prevErrorRef.current = null

    dispatch(
      loginUser({ email: formData.email, password: formData.password }),
    ).then((resultAction) => {
      if (loginUser.fulfilled.match(resultAction)) {
        dispatch(
          getUserToken({ email: formData.email, password: formData.password }),
        ).then((tokenResult) => {
          if (getUserToken.fulfilled.match(tokenResult)) {
            toast.success('Успешный вход', { autoClose: 3000 })
            router.push('/music/main')
          }
        })
      }
    })
  }

  return (
    <>
      <Loading />
      <form onSubmit={handleSubmit} className={styles.modal__form}>
        <Link href={'/music/main'} className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </Link>
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
        <button
          disabled={isDisabled}
          type="submit"
          className={styles.modal__btnEnter}
        >
          Войти
        </button>
        <Link href="/auth/signup" className={styles.modal__btnSignup}>
          Зарегистрироваться
        </Link>
      </form>
    </>
  )
}
