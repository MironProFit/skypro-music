import styles from './page.module.css'
import Bar from '@components/Bar/Bar'
import HeaderNav from '../components/HeaderNav/HeaderNav'
import Sidebar from '@components/Sidebar/Sidebar'
import TrackList from '@components/TrackList/TrackList'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <HeaderNav />
          <TrackList />
          <Sidebar />
          <Bar />
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </div>
  )
}
