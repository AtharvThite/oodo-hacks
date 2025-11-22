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

export const deleteReceipt = createAsyncThunk(
  'receipts/deleteReceipt',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/receipts/${id}`)
      return { _id: id, ...response.data }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete receipt')
    }
  }
)

const initialState = {
  items: [],
  currentReceipt: null,
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

const receiptSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentReceipt: (state) => {
      state.currentReceipt = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Receipts
      .addCase(fetchReceipts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle both response formats: action.payload.data or action.payload.receipts
        state.items = action.payload.data || action.payload.receipts || []
        
        // Handle pagination from different response formats
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.current || action.payload.pagination.page || 1,
            limit: action.payload.pagination.limit || 20,
            totalItems: action.payload.pagination.totalItems || 0,
            totalPages: action.payload.pagination.total || action.payload.pagination.totalPages || 0
          }
        } else {
          // Fallback for direct pagination fields
          state.pagination = {
            page: action.payload.page || 1,
            limit: action.payload.limit || 20,
            totalItems: action.payload.totalItems || state.items.length,
            totalPages: action.payload.totalPages || Math.ceil((action.payload.totalItems || state.items.length) / 20)
          }
        }
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.items = []
      })
      
      // Fetch Single Receipt
      .addCase(fetchReceipt.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReceipt.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle multiple response formats
        state.currentReceipt = action.payload.data || action.payload.receipt || action.payload
      })
      .addCase(fetchReceipt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.currentReceipt = null
      })
      
      // Create Receipt
      .addCase(createReceipt.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createReceipt.fulfilled, (state, action) => {
        state.isCreating = false
        // Handle multiple response formats
        const newReceipt = action.payload.data || action.payload.receipt || action.payload
        state.items.unshift(newReceipt)
        state.pagination.totalItems += 1
      })
      .addCase(createReceipt.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      
      // Update Receipt
      .addCase(updateReceipt.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateReceipt.fulfilled, (state, action) => {
        state.isUpdating = false
        // Handle multiple response formats
        const updatedReceipt = action.payload.data || action.payload.receipt || action.payload
        
        const index = state.items.findIndex(item => item._id === updatedReceipt._id)
        if (index !== -1) {
          state.items[index] = updatedReceipt
        }
        
        // Update current receipt if it matches
        if (state.currentReceipt?._id === updatedReceipt._id) {
          state.currentReceipt = updatedReceipt
        }
      })
      .addCase(updateReceipt.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      
      // Delete Receipt
      .addCase(deleteReceipt.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteReceipt.fulfilled, (state, action) => {
        state.isDeleting = false
        state.items = state.items.filter(item => item._id !== action.payload._id)
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1)
        
        // Clear current receipt if deleted
        if (state.currentReceipt?._id === action.payload._id) {
          state.currentReceipt = null
        }
      })
      .addCase(deleteReceipt.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload
      })
  }
})

export const { clearError, setFilters, clearCurrentReceipt } = receiptSlice.actions
export default receiptSlice.reducer