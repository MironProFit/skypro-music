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
  // 🔥 Специальная обработка для "года выпуска"
  if (typeFilter === 'release_date') {
    const yearOptions = [
      { label: 'По умолчанию', value: 'default' },
      { label: 'Сначала новые', value: 'new-first' },
      { label: 'Сначала старые', value: 'old-first' },
    ]

    return (
      <div className={styles.modalWrap}>
        <ul className={styles.modalList}>
          {yearOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onToggle(option.value)
                onClose()
              }}
              className={clsx(
                styles.modalItem,
                selectedValues.includes(option.value) && styles.modalItem_active
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Обычное поведение для author, genre
  const uniqueValues = useChangeFilters(typeFilter)

  return (
    <div className={styles.modalWrap}>
      <ul className={styles.modalList}>
        {uniqueValues.length > 0 ? (
          uniqueValues.map((value) => (
            <li
              key={value}
              onClick={() => {
                onToggle(value)
                onClose()
              }}
              className={clsx(
                styles.modalItem,
                selectedValues.includes(value) && styles.modalItem_active
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