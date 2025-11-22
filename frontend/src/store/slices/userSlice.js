import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/userService'

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await userService.getUsers(params)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      )
    }
  }
)

// Create user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await userService.createUser(userData)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create user'
      )
    }
  }
)

// Update user role
export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      return await userService.updateUserRole(userId, role)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user role'
      )
    }
  }
)

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await userService.deleteUser(userId)
      return userId
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      )
    }
  }
)

const initialState = {
  items: [],
  pagination: {
    current: 1,
    total: 0,
    totalItems: 0
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreating = false
        state.items.unshift(action.payload.data)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.items.findIndex(user => user._id === action.payload.data._id)
        if (index !== -1) {
          state.items[index] = action.payload.data
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeleting = false
        state.items = state.items.filter(user => user._id !== action.payload)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer
