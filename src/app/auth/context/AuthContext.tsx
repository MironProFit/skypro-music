'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/store'
import { setFormData } from 'src/store/features/authSlice'
import { FormData } from 'src/sharedTypes/sharedTypes'

type AuthContextType = {
  formData: FormData
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const formData = useAppSelector((state) => state.auth.formData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    const { name, value } = e.target
    dispatch(setFormData({ [name]: value }))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Форма отправлена')
  }

  return (
    <AuthContext.Provider value={{ formData, handleChange, handleSubmit }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
