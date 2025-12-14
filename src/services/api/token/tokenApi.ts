import { createAsyncThunk } from '@reduxjs/toolkit'
import { getStoredUserData } from 'src/store/features/auth/authSlice'

interface TokenSuccessResponse {
  refresh: string
  access: string
}

// Ошибка от сервера
interface TokenErrorResponse {
  message: string
  success: false
}

// Общий тип ответа
type TokenResponse = TokenSuccessResponse | TokenErrorResponse
const userData = getStoredUserData()
console.log(userData);

// export const getTokenFromApi = createAsyncThunk<TokenResponse,{rejectValue: string}>(
//     'auth/getTokenFromApi',
   
// )

