// src/components/ProtectedRoute.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAppSelector } from 'src/store/store'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  // Эффект срабатывает при монтировании и при изменении isLoggedIn
  useEffect(() => {
    if (!isLoggedIn) {
      // Если не залогинен - перенаправляем
      router.replace('/auth/signin')
    }
    // Если залогинен - ничего не делаем, рендерим children
  }, [isLoggedIn, router])


  if (!isLoggedIn) {

    return null; 
  }

  return <>{children}</>
}