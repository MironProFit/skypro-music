import axios from 'axios'
import { GET_ALL_TRACKS } from 'src/config/apiEndpoints'

export const getTracksApi = axios.get(`${GET_ALL_TRACKS}`)
