export interface Track {
  _id: number
  name: string
  author: string
  release_date: string
  genre: string[]
  duration_in_seconds: number
  album: string
  logo: null
  track_file: string
  stared_user: string[]
}

export interface TrackApiResponse {
  success: boolean
  data: Track[]
  message?: string
}

export interface SelectionResponse {
  success: boolean
  data: Selection
}

export interface TracksByIdsRequest {
  ids: number[]
}

export interface TracksByIdsResponse {
  success: boolean
  data: Track[]
}

export interface Selection {
  _id: string
  name: string
  items: string[]
  owner: string
  __v: number
}

export interface SelectionsState {
  list: Selection[]
  currentCollection: string
  loading: boolean
  error: string | null
}
