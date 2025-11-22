import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../services/authService'

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.login(userData)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user'
      )
    }
  }
)

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      return await authService.forgotPassword(email)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send reset email'
      )
    }
  }
)

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      return await authService.resetPassword(resetData)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Password reset failed'
      )
    }
  }
)

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, logout, setCredentials } = authSlice.actions
export default authSlice.reducer