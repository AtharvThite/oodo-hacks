import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// Async thunks
export const fetchTransfers = createAsyncThunk(
  'transfers/fetchTransfers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/transfers', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transfers')
    }
  }
)

export const fetchTransfer = createAsyncThunk(
  'transfers/fetchTransfer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/transfers/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transfer')
    }
  }
)

export const createTransfer = createAsyncThunk(
  'transfers/createTransfer',
  async (transferData, { rejectWithValue }) => {
    try {
      const response = await api.post('/transfers', transferData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create transfer')
    }
  }
)

export const updateTransfer = createAsyncThunk(
  'transfers/updateTransfer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/transfers/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update transfer')
    }
  }
)

export const deleteTransfer = createAsyncThunk(
  'transfers/deleteTransfer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/transfers/${id}`)
      return { _id: id, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transfer')
    }
  }
)

const initialState = {
  items: [],
  currentTransfer: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    totalItems: 0,
    totalPages: 0
  },
  filters: {
    search: '',
    status: ''
  }
}

const transferSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransfers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransfers.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data || []
        state.pagination = {
          page: action.payload.pagination?.current || 1,
          limit: 20,
          totalItems: action.payload.pagination?.totalItems || 0,
          totalPages: action.payload.pagination?.total || 0
        }
      })
      .addCase(fetchTransfers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      .addCase(fetchTransfer.fulfilled, (state, action) => {
        state.currentTransfer = action.payload.data
      })
      
      .addCase(createTransfer.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.isCreating = false
        state.items.unshift(action.payload.data)
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      
      .addCase(updateTransfer.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateTransfer.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.items.findIndex(item => item._id === action.payload.data._id)
        if (index !== -1) {
          state.items[index] = action.payload.data
        }
        state.currentTransfer = action.payload.data
      })
      .addCase(updateTransfer.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      
      .addCase(deleteTransfer.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteTransfer.fulfilled, (state, action) => {
        state.isDeleting = false
        state.items = state.items.filter(item => item._id !== action.payload._id)
        if (state.currentTransfer?._id === action.payload._id) {
          state.currentTransfer = null
        }
      })
      .addCase(deleteTransfer.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload
      })
  }
})

export const { clearError, setFilters } = transferSlice.actions
export default transferSlice.reducer