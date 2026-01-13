// Track
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

// Selection
export interface Selection {
  _id: number
  name: string
  items: number[]
  owner: number[]
  __v: number
}

// State
export interface SelectionsState {
  list: Selection[]
  currentCollection: string
  loading: boolean
  error: string | null
}

// API Responses
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
