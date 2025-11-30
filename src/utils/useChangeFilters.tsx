import { useMemo } from 'react'
import { dataTrack } from 'src/data'
import { FiltersTagType, TrackType } from 'src/sharedTypes/sharedTypes'

export default function useChangeFilters(typeFilter: FiltersTagType) {
  const uniqueValues = useMemo(() => {
    const values = dataTrack.map((track) => track[typeFilter])
    const uniqueSet = new Set(values)

    const uniqueArray = Array.from(uniqueSet)

    if (typeFilter === 'genre') {
      const allGenres = dataTrack.flatMap((track) =>
        Array.isArray(track.genre) ? track.genre : []
      )
      const uniqueGenres = Array.from(new Set(allGenres))
      return uniqueGenres.sort((a, b) => a.localeCompare(b))
    }

    if (typeFilter === 'release_date') {
      const dateValues = uniqueArray
      return dateValues
        .slice()
        .sort(
          (a, b) =>
            new Date(a.toLocaleString()).getTime() -
            new Date(b.toLocaleString()).getTime()
        )
    } else {
      const stringValues = uniqueArray.filter((a): a is string => a !== '-')
      return stringValues.sort((a, b) => a.localeCompare(b))
    }
  }, [dataTrack, typeFilter])
  return uniqueValues
}
