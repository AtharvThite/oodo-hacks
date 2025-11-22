import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// Async thunks
export const fetchReceipts = createAsyncThunk(
  'receipts/fetchReceipts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/receipts', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch receipts')
    }
  }
)

export const fetchReceipt = createAsyncThunk(
  'receipts/fetchReceipt',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/receipts/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch receipt')
    }
  }
)

export const createReceipt = createAsyncThunk(
  'receipts/createReceipt',
  async (receiptData, { rejectWithValue }) => {
    try {
      const response = await api.post('/receipts', receiptData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create receipt')
    }
  }
)

export const updateReceipt = createAsyncThunk(
  'receipts/updateReceipt',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/receipts/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update receipt')
    }
  }
)

const initialState = {
  items: [],
  currentReceipt: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
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

const receiptSlice = createSlice({
  name: 'receipts',
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
      .addCase(fetchReceipts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.receipts || []
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          totalItems: action.payload.totalItems || 0,
          totalPages: action.payload.totalPages || 0
        }
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      .addCase(fetchReceipt.fulfilled, (state, action) => {
        state.currentReceipt = action.payload.receipt
      })
      
      .addCase(createReceipt.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createReceipt.fulfilled, (state, action) => {
        state.isCreating = false
        state.items.unshift(action.payload.receipt)
      })
      .addCase(createReceipt.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      
      .addCase(updateReceipt.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateReceipt.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.items.findIndex(item => item._id === action.payload.receipt._id)
        if (index !== -1) {
          state.items[index] = action.payload.receipt
        }
        state.currentReceipt = action.payload.receipt
      })
      .addCase(updateReceipt.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
  }
})

export const { clearError, setFilters } = receiptSlice.actions
export default receiptSlice.reducer