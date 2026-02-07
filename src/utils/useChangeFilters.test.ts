import { renderHook, waitFor } from '@testing-library/react'
import useChangeFilters from './useChangeFilters'

// Моковые данные для треков
const mockTracks = [
  {
    _id: 1,
    name: 'Track 1',
    author: 'Artist 1',
    album: 'Album 1',
    genre: ['Rock', 'Pop'],
    release_date: '2020-01-15',
  },
  {
    _id: 2,
    name: 'Track 2',
    author: 'Artist 2',
    album: 'Album 2',
    genre: 'Pop',
    release_date: '2019-05-20',
  },
  {
    _id: 3,
    name: 'Track 3',
    author: 'Artist 1',
    album: 'Album 3',
    genre: ['Rock', 'Metal'],
    release_date: '2021-03-10',
  },
]

describe('useChangeFilters', () => {
  beforeEach(() => {
   global.window.localStorage.clear()
  })

  it('возвращает пустой массив, если нет данных в localStorage', async () => {
    const { result } = renderHook(() => useChangeFilters('author'))

    await waitFor(() => {
      expect(result.current).toEqual([])
    })
  })

  it('возвращает уникальные авторов', async () => {
   global.window.localStorage.setItem('tracks_cache', JSON.stringify(mockTracks))

    const { result } = renderHook(() => useChangeFilters('author'))

    await waitFor(() => {
      expect(result.current).toEqual(['Artist 1', 'Artist 2'])
    })
  })

  it('возвращает уникальные жанры (распаковывает массивы)', async () => {
   global.window.localStorage.setItem('tracks_cache', JSON.stringify(mockTracks))

    const { result } = renderHook(() => useChangeFilters('genre'))

    await waitFor(() => {
      expect(result.current).toEqual(['Metal', 'Pop', 'Rock'])
    })
  })

  it('возвращает уникальные даты выпуска (отсортированные)', async () => {
   global.window.localStorage.setItem('tracks_cache', JSON.stringify(mockTracks))

    const { result } = renderHook(() => useChangeFilters('release_date'))

    await waitFor(() => {
      expect(result.current).toEqual(['2019-05-20', '2020-01-15', '2021-03-10'])
    })
  })
})
