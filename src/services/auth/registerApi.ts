import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE_URL, POST_SIGNUP_PATH } from 'src/constants'

export const registerUser = createAsyncThunk(
  'auth/fetchAuth',
  async ({ email: string, password: string, username: string }) => {
    const res = await axios.post(`${API_BASE_URL}+${POST_SIGNUP_PATH}`, {
      email,
      password,
      username,
    })
    return res.data
  }
)
