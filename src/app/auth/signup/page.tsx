'use client'

import styles from './signup.module.css'
import Link from 'next/link'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { getUserToken, registerUser, resetFormData } from '@store/auth'
import { toast } from 'react-toastify'

export default function SignUpPage() {
  const { formData, handleChange, errors: fieldErrors, setErrors } = useAuth()
  const dispatch = useAppDispatch()
  const router = useRouter() //  Вызываем ОДИН РАЗ на верхнем уровне
  const error = useAppSelector((state) => state.auth.error)

  const tokenAccessData = useAppSelector((s) => s.auth.userData.tokenAccess)
  const tokenRefreshData = useAppSelector((s) => s.auth.userData.tokenRefresh)

  // Локальное состояние для подтверждения пароля
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [confirmError, setConfirmError] = useState('')

  useEffect(() => {
    dispatch(resetFormData())
    setErrors({ email: '', password: '' })
    setPasswordConfirm('')
    setConfirmError('')
  }, [dispatch, setErrors])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Валидация подтверждения пароля
  const validateConfirm = (password: string, confirm: string) => {
    if (!confirm) return 'Введите пароль ещё раз'
    if (password !== confirm) return 'Пароли не совпадают'
    return ''
  }

  // Обработчик изменения подтверждения пароля
  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPasswordConfirm(value)
    setConfirmError(validateConfirm(formData.password, value))
  }

  //  Обработчик БЕЗ возврата JSX
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const confirmErr = validateConfirm(formData.password, passwordConfirm)
    setConfirmError(confirmErr)

    const isBasicValid = !fieldErrors.email && !fieldErrors.password
    if (isBasicValid && !confirmErr) {
      dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          username: formData.username || formData.email.split('@')[0],
        }),
      ).then((resultAction) => {
        if (registerUser.fulfilled.match(resultAction)) {
          //  Получаем токены после регистрации
          toast.success('Успешная регистрация')
          dispatch(
            getUserToken({
              email: formData.email,
              password: formData.password,
            }),
          ).then((tokenResult) => {
            if (getUserToken.fulfilled.match(tokenResult)) {
              //  Перенаправляем на главную
              router.push('/music/main')
            }
          })
        }
      })
    }
  }

  //  Вычисляем состояние кнопки на уровне компонента
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
      <Link href="/music/main" className={styles.modal__logo}>
        <img src="/img/logo_modal.png" alt="logo" />
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
