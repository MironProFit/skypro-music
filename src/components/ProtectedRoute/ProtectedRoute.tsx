'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  useEffect(() => {
    const hasToken =
      typeof window !== 'undefined' && localStorage.getItem('userData')
    if (!hasToken) {
      router.replace('/auth/signin')
    }
  }, [router])

  if (typeof window !== 'undefined' && localStorage.getItem('userDate')) {
    return <div>Загрузка...</div>
  }

  return <>{children}</>
}
