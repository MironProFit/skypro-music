// src/components/SortDropdown/SortDropdown.tsx
'use client'

import styles from './SortDropdown.module.css'
import { FiltersTagType } from 'src/sharedTypes/sharedTypes'
import useChangeFilters from '@utils/useChangeFilters'
import clsx from 'clsx'

interface SortDropdownProps {
  typeFilter: FiltersTagType
  selectedValues: string[]
  onToggle: (value: string) => void
  onClose: () => void
}

export default function SortDropdown({
  typeFilter,
  selectedValues,
  onToggle,
  onClose,
}: SortDropdownProps) {
  const uniqueValues = useChangeFilters(typeFilter)

  return (
    <div className={styles.modalWrap}>
      <ul className={styles.modalList}>
        {uniqueValues.length > 0 ? (
          uniqueValues.map((value) => (
            <li
              key={value}
              onClick={() => onToggle(value)}
              className={clsx(
                styles.modalItem,
                selectedValues.includes(value) && styles.modalItem_active // ← подсветка
              )}
            >
              {value}
            </li>
          ))
        ) : (
          <li className={styles.modalItem}>нет данных</li>
        )}
      </ul>
    </div>
  )
}
