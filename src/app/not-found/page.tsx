import Link from 'next/link'
import styles from './notFound.module.css'

export default function NotFoundPage() {
    return (
        <div className={styles.notFound}>
            <h1>404 Привет</h1>
            <p>Страница не найдена</p>
            <Link href="/">Вернуться на главную</Link>
        </div>
    )
}
