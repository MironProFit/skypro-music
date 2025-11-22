'use client'

import { useEffect, useState } from 'react'
import styles from './Search.module.css'

export default function Search() {
    const [searchInput, setSearchInput] = useState('')
    const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }
    useEffect(() => {
        console.log(searchInput)
    }, [searchInput])
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
                value={searchInput}
                onChange={onSearchInput}
            />
        </div>
    )
}
