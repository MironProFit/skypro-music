'use client'

import { useAppSelector } from 'src/store/store'
import styles from './Loading.module.css'

export default function Loading() {
  const isLoading = useAppSelector((state) => state.auth.isDataLoading)
  return (
    isLoading && (
      <div className={styles.overlay}>
        <div className={styles.spinner}>
          <div className={`${styles.wave} ${styles.wave1}`} />
          <div className={`${styles.wave} ${styles.wave2}`} />
          <div className={`${styles.wave} ${styles.wave3}`} />
          <div className={`${styles.wave} ${styles.wave4}`} />
          <div className={`${styles.wave} ${styles.wave5}`} />
        </div>
      </div>
    )
  )
}
