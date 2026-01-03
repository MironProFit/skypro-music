'use client'

import Loading from '@components/Loading/Loading'
import { createContext, ReactNode, useContext, useState } from 'react'
import { FormData } from 'src/sharedTypes/sharedTypes'
import { setFormData } from 'src/store/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from 'src/store/store'

type FormErrors = {
  email: string
  password: string
  username?: string
}

type AuthContextType = {
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [errors, setErrors] = useState<FormErrors>({ email: '', password: '' })
  const dispatch = useAppDispatch()
  const formData = useAppSelector((state) => state.auth.formData)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email) ? '' : 'Введите корректную почту'
  }

  const validatePassword = (password: string) => {
    return password.length >= 6 ? '' : 'Пароль должен быть не менее 6 символов'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'email' || name === 'password') {
      dispatch(setFormData({ [name]: value }))
    }

    let errorMessage = ''
    if (name === 'email') {
      errorMessage = validateEmail(value)
    } else if (name === 'password') {
      errorMessage = validatePassword(value)
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }))
  }

  return (
    <AuthContext.Provider value={{ formData, handleChange, errors, setErrors }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
