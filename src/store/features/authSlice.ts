import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { registerUser } from 'src/services/auth/registerApi'
import { FormData } from 'src/sharedTypes/sharedTypes'

type AuthState = {
  formData: FormData
  error: string | null
  loading: boolean
  isLoggedIn: boolean
}

const initialState: AuthState = {
  formData: {
    email: '',
    password: '',
    username: '',
    passwordConfirm: '',
  },
  error: null,
  loading: false,
  isLoggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      Object.assign(state.formData, action.payload)
      if (action.payload.email) {
        state.formData.username =
          action.payload.email.split('@')[0].charAt(0).toUpperCase() +
          action.payload.email.split('@')[0].slice(1)
      }
    },
    // setError: (state, action: PayloadAction<string | null>) => {
    //   state.error = action.payload
    // },
    // setLoading: (state, action: PayloadAction<boolean>) => {
    //   state.loading = action.payload
    // },
    resetFormData: (state) => {
      state.formData = initialState.formData
      state.error = null
    },
    // submitForm: (state) => {
    //   state.loading = true
    //   state.error = null
    // },
    // formSuccess: (state) => {
    //   state.loading = false
    //   state.error = null
    // },
    // formFailure: (state, action: PayloadAction<string>) => {
    //   state.loading = false
    //   state.error = action.payload
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.isLoggedIn = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        if (state.error) {
          state.error = action.payload as string
        }
      })
  },
})

export const {
  setFormData,
  resetFormData,
  // submitForm,
  // formSuccess,
  // formFailure,
  // setError,
  // setLoading,
} = authSlice.actions
export default authSlice.reducer
