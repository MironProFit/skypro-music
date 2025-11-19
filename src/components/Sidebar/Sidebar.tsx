import Image from 'next/image'
import styles from './Sidebar.module.css'
import Link from 'next/link'

export default function Sidebar() {
    return (
        <div className={styles.main__sidebar}>
            <div className={styles.sidebar__personal}>
                <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
                <div className={styles.sidebar__icon}>
                    <svg>
                        <use xlinkHref="/img/icon/sprite.svg#logout" />
                    </svg>
                </div>
            </div>
            <div className={styles.sidebar__block}>
                <div className={styles.sidebar__list}>
                    {[1, 2, 3].map((id) => (
                        <div key={id} className={styles.sidebar__item}>
                            <Link className={styles.sidebar__link} href="#">
                                <Image
                                    className={styles.sidebar__img}
                                    src={`/img/playlist0${id}.png`}
                                    alt="day's playlist"
                                    width={250}
                                    height={150}
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
