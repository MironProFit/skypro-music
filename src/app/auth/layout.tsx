import { ReactNode } from 'react'
import { AuthProvider } from './context/AuthContext'
import styles from './layout.module.css'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className={styles.wrapper}>
        <div className={styles.containerEnter}>
          <div className={styles.modal__block}>{children}</div>
        </div>
      </div>
    </AuthProvider>
  )
}
