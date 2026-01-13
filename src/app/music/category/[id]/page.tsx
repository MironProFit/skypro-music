'use client'

import TrackList from '@components/TrackList/TrackList'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { useAppSelector } from 'src/store/store'

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const selections = useAppSelector((state) => state.selections.list)

  const categoryId = useMemo(() => {
    const num = Number(params?.id)
    return isNaN(num) ? null : num
  }, [params?.id])

  const currentSelection = useMemo(() => {
    if (categoryId === null) return null
    return selections.find((s) => s._id === categoryId) || null
  }, [selections, categoryId])

  return (
    <TrackList
      categoryName={currentSelection?.name}
      categoryTrackIds={currentSelection?.items}
    />
  )
}
