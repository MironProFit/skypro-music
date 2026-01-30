//API - запросы
// src/config/apiEndpoints.ts

export const BASE_API_URL = 'https://webdev-music-003b5b991590.herokuapp.com'

// === Авторизация ===
export const SIGNUP_ENDPOINT = '/user/signup/'
export const SIGNIN_ENDPOINT = '/user/login/'
export const TOKEN_ENDPOINT = '/user/token/'
export const REFRESH_TOKEN_ENDPOINT =  '/user/token/refresh'

// === Треки ===
export const GET_ALL_TRACKS = '/catalog/track/all/'
export const GET_TRACK_BY_ID = (id: number) => `/catalog/track/${id}/`

// === Избранное ===
export const GET_FAVORITE_TRACKS = '/catalog/track/favorite/all/'
export const ADD_TO_FAVORITES = (id: number) => `/catalog/track/${id}/favorite/`
export const REMOVE_FROM_FAVORITES = (id: number) =>
  `/catalog/track/${id}/favorite/`

// === Подборки ===
export const GET_ALL_SELECTIONS = '/catalog/selection/all/'
export const GET_SELECTION_BY_ID = (id: number) => `/catalog/selection/${id}/`
export const CREATE_SELECTION = '/catalog/selection/'
