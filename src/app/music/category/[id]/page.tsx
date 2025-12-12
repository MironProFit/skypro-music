'use client'

import TrackList from '@components/TrackList/TrackList'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TrackType } from 'src/sharedTypes/sharedTypes'

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const { id } = params
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [categoryTracks, setCategoryTracks] = useState<TrackType[] | null>(null)
  useEffect(() => {
    if (id) setCategoryId(id)
  }, [id])

  return <TrackList categoryId={categoryId} categoryTracks={categoryTracks} />
}
