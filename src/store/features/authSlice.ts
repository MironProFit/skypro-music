import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  formData: {
    email: '',
    password: '',
    username: '',
    passwordConfirm: '',
  },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<{ [key: string]: string }>) {
      state.formData = { ...state.formData, ...action.payload }
      //   console.log(state.formData)
    },
  },
})

export const { setFormData } = authSlice.actions
export const authSliceReducer = authSlice.reducer
