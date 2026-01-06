'use client'

import styles from './signup.module.css'
import Link from 'next/link'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { getUserToken, registerUser, resetFormData } from '@store/auth'

export default function SignUpPage() {
  const { formData, handleChange, errors: fieldErrors, setErrors } = useAuth()
  const dispatch = useAppDispatch()
  const param = useParams()  
  const error = useAppSelector((state) => state.auth.error)

  // Локальное состояние для подтверждения пароля и его ошибки
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const tokenAccessData = useAppSelector((s) => {
    s.auth.userData.tokenAccess
  })
  const tokenRefreshData = useAppSelector((s) => {
    s.auth.userData.tokenRefresh
  })

  useEffect(() => {
    dispatch(resetFormData())
    setErrors({ email: '', password: '' })
    setPasswordConfirm('')
    setConfirmError('')
  }, [param, dispatch, setErrors])

  // Валидация подтверждения пароля
  const validateConfirm = (password: string, confirm: string) => {
    if (!confirm) return 'Введите пароль ещё раз'
    if (password !== confirm) return 'Пароли не совпадают'
    return ''
  }

  // Обработчик изменения confirm
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPasswordConfirm(value)
    setConfirmError(validateConfirm(formData.password, value))
  }

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const confirmErr = validateConfirm(formData.password, passwordConfirm)
    setConfirmError(confirmErr)

    const router = useRouter()

    const isBasicValid = !fieldErrors.email && !fieldErrors.password
    if (isBasicValid && !confirmErr) {
      dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          username: formData.username || formData.email.split('@')[0],
        })
      ).then((resultAction) => {
        if (registerUser.fulfilled.match(resultAction)) {
          // После успешной регистрации переходим на страницу входа
          router.push('/')

          // Проверка наличия токенов
          if (tokenAccessData !== null || tokenRefreshData !== null) {
            dispatch(
              getUserToken({
                email: formData.email,
                password: formData.password,
              })
            ).then((tokenResult) => {
              if (getUserToken.fulfilled.match(tokenResult)) {
                // После получения токена, перенаправляем на главную
                router.push('/')
              }
            })
          }
        }
      })
    }
    // Блокировка кнопки
    const isDisabled =
      !!fieldErrors.email ||
      !!fieldErrors.password ||
      !formData.email ||
      !formData.password ||
      !passwordConfirm ||
      !!confirmError

    return (
      <form onSubmit={handleSubmit} className={styles.modal__form}>
        {/* Логотип */}
        <Link href="/music/main">
          <div className={styles.modal__logo}>
            <img src="/img/logo_modal.png" alt="logo" />
          </div>
        </Link>

        {/* Email */}
        <input
          className={clsx(styles.modal__input, styles.marginBottom30)}
          type="text"
          name="email"
          placeholder="Почта"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div
          className={clsx(styles.errorContainer, {
            [styles.active]: !!fieldErrors.email,
          })}
        >
          {fieldErrors.email}
        </div>

        {/* Пароль */}
        <input
          className={clsx(styles.modal__input, styles.marginBottom30)}
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div
          className={clsx(styles.errorContainer, {
            [styles.active]: !!fieldErrors.password,
          })}
        >
          {fieldErrors.password}
        </div>

        {/* Подтверждение пароля */}
        <input
          className={clsx(styles.modal__input, styles.marginBottom30)}
          type="password"
          name="passwordConfirm"
          placeholder="Повторите пароль"
          value={passwordConfirm}
          onChange={handleConfirmChange}
          required
        />
        <div
          className={clsx(styles.errorContainer, {
            [styles.active]: !!confirmError,
          })}
        >
          {confirmError}
        </div>

        <div className={styles.warning}>{error}</div>

        {/* Кнопка "Зарегистрироваться" */}
        <button
          type="submit"
          className={styles.modal__btnEnter}
          disabled={isDisabled}
        >
          Зарегистрироваться
        </button>
      </form>
    )
  }
}
