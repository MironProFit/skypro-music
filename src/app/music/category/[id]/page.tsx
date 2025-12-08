'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  useEffect(() => {
    console.log(params)
  }, [params])

  return (
    <>
      <div>категория {params.id}</div>
    </>
  )
}
