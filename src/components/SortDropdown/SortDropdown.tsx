'use client'
import styles from './SortDropdown.module.css'
import { FiltersTagType, TrackType } from 'src/sharedTypes/sharedTypes'
import useChangeFilters from '@utils/useChangeFilters'

interface SortDropdownProps {
  typeFilter: FiltersTagType
}

export default function SortDropdown({ typeFilter }: SortDropdownProps) {
  const uniqueValues = useChangeFilters(typeFilter)

  return (
    <div className={styles.modalWrap}>
      <ul className={styles.modalList}>
        {uniqueValues.length > 0 ? (
          uniqueValues.map((value, index) => (
            <li className={styles.modalItem} key={index}>
              {value || 'нет даннх'}
            </li>
          ))
        ) : (
          <li className={styles.modalItem}>нет данных</li>
        )}
      </ul>
    </div>
  )
}
