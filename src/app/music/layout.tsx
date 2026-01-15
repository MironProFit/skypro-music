import styles from './layout.module.css'
import Bar from '@components/Bar/Bar'
import HeaderNav from '@components/HeaderNav/HeaderNav'
import Sidebar from '@components/Sidebar/Sidebar'
import { ReactNode } from 'react'

type MainLayout = { children: ReactNode }

export default function MusicLayout({ children }: MainLayout) {
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
