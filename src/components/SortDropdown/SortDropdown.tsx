'use client'
import { useEffect, useMemo, useState } from 'react'
import styles from './SortDropdown.module.css'
import { dataTrack } from 'src/data'
import { TrackType } from 'src/sharedTypes/sharedTypes'

interface SortDropdownProps {
  typeFilter: keyof TrackType
}

export default function SortDropdown({ typeFilter }: SortDropdownProps) {
  const uniqueValues = useMemo(() => {
    const values = dataTrack.map((track) => track[typeFilter])
    const uniqueSet = new Set(values)
    console.log(typeof uniqueSet)
    const uniqueArray = Array.from(uniqueSet)
    if (typeFilter === 'release_date') {
      const dateValues = uniqueArray.filter(
        (a): a is string | number =>
          a !== null && (typeof a === 'string' || typeof a === 'number')
      )
      return dateValues
        .slice()
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    } else {
      const stringValues = uniqueArray.filter(
        (a): a is string => typeof a === 'string' && a !== '-'
      )
      return stringValues.sort((a, b) => a.localeCompare(b))
    }
  }, [dataTrack, typeFilter])

  return (
    <div className={styles.modalWrap}>
      <ul className={styles.modalList}>
        {uniqueValues.map((value, index) => (
          <li className={styles.modalItem} key={index}>
            {value || 'нет даннх'}
          </li>
        ))}
      </ul>
    </div>
  )
}
