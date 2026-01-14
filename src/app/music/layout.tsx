'use client'

import styles from './layout.module.css'
import Bar from '@components/Bar/Bar'
import HeaderNav from '@components/HeaderNav/HeaderNav'
import Sidebar from '@components/Sidebar/Sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useAppSelector } from 'src/store/store'

type MainLayout = { children: ReactNode }

export default function MusicLayout({ children }: MainLayout) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <HeaderNav />
          {children}
          <Sidebar />
          <Bar />
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </div>
  )
}
