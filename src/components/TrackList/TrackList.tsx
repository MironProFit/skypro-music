import clsx from 'clsx'
import styles from './TrackList.module.css'
import Link from 'next/link'

export default function TrackList() {
    return (
        <div className={styles.centerblock}>
            <div className={styles.centerblock__search}>
                <svg className={styles.search__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-search" />
                </svg>
                <input
                    className={styles.search__text}
                    type="search"
                    placeholder="Поиск"
                    name="search"
                />
            </div>
            <h2 className={styles.centerblock__h2}>Треки</h2>
            <div className={styles.centerblock__filter}>
                <div className={styles.filter__title}>Искать по:</div>
                <div className={styles.filter__button}>исполнителю</div>
                <div className={styles.filter__button}>году выпуска</div>
                <div className={styles.filter__button}>жанру</div>
            </div>

            <div className={styles.centerblock__content}>
                <div className={styles.content__title}>
                    <div
                        className={clsx(
                            styles.playlistTitle__col,
                            styles.col01
                        )}
                    >
                        Трек
                    </div>
                    <div
                        className={clsx(
                            styles.playlistTitle__col,
                            styles.col02
                        )}
                    >
                        Исполнитель
                    </div>
                    <div
                        className={clsx(
                            styles.playlistTitle__col,
                            styles.col03
                        )}
                    >
                        Альбом
                    </div>
                    <div
                        className={clsx(
                            styles.playlistTitle__col,
                            styles.col04
                        )}
                    >
                        <svg className={styles.playlistTitle__svg}>
                            <use xlinkHref="/img/icon/sprite.svg#icon-watch" />
                        </svg>
                    </div>
                </div>

                <div className={styles.content__playlist}>
                    {[
                        {
                            title: 'Guilt',
                            author: 'Nero',
                            album: 'Welcome Reality',
                            time: '4:44',
                        },
                        {
                            title: 'Elektro',
                            author: 'Dynoro, Outwork, Mr. Gee',
                            album: 'Elektro',
                            time: '2:22',
                        },
                        {
                            title: 'I’m Fire',
                            author: 'Ali Bakgor',
                            album: 'I’m Fire',
                            time: '2:22',
                        },
                        {
                            title: 'Non Stop',
                            author: 'Стоункат, Psychopath',
                            album: 'Non Stop',
                            time: '4:12',
                            span: '(Remix)',
                        },
                        {
                            title: 'Run Run',
                            author: 'Jaded, Will Clarke, AR/CO',
                            album: 'Run Run',
                            time: '2:54',
                            span: '(feat. AR/CO)',
                        },
                    ].map((track, index) => (
                        <div key={index} className={styles.playlist__item}>
                            <div className={styles.playlist__track}>
                                <div className={styles.track__title}>
                                    <div className={styles.track__titleImage}>
                                        <svg className={styles.track__titleSvg}>
                                            <use xlinkHref="/img/icon/sprite.svg#icon-note" />
                                        </svg>
                                    </div>
                                    <div className={styles.track__title_text}>
                                        <Link
                                            className={styles.track__titleLink}
                                            href=""
                                        >
                                            {track.title}
                                            {track.span && (
                                                <span
                                                    className={
                                                        styles.track__titleSpan
                                                    }
                                                >
                                                    {track.span}
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                                <div className={styles.track__author}>
                                    <Link
                                        className={styles.track__authorLink}
                                        href=""
                                    >
                                        {track.author}
                                    </Link>
                                </div>
                                <div className={styles.track__album}>
                                    <Link
                                        className={styles.track__albumLink}
                                        href=""
                                    >
                                        {track.album}
                                    </Link>
                                </div>
                                <div className={styles.track__time}>
                                    <svg className={styles.track__timeSvg}>
                                        <use xlinkHref="/img/icon/sprite.svg#icon-like" />
                                    </svg>
                                    <span className={styles.track__timeText}>
                                        {track.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
