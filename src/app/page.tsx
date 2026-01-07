'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomeRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hasToken =
      typeof window !== undefined && localStorage.getItem('userData')

    if (hasToken) {
      router.replace('/music/main')
    } else {
      router.replace('/auth/signin')
    }
  }, [router])
  return null
}
