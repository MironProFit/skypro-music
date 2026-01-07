'use client'

import TrackList from '@components/TrackList/TrackList'
import { Track } from '@store/catalog'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const { id } = params
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [categoryTracks, setCategoryTracks] = useState<Track[] | null>(null)
  useEffect(() => {
    if (id) setCategoryId(id)
  }, [id])

  return <TrackList categoryId={categoryId} categoryTracks={categoryTracks} />
}
