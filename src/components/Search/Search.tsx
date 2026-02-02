// src/components/Search/Search.tsx
'use client'

import { ChangeEvent } from 'react'
import styles from './Search.module.css'

type SearchProps = {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function Search({ value, onChange }: SearchProps) {
  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search" />
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={value}
        onChange={onChange}
        aria-label="Поиск треков"
      />
    </div>
  )
}