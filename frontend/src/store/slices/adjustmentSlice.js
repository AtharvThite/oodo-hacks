import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// Async thunks
export const fetchAdjustments = createAsyncThunk(
  'adjustments/fetchAdjustments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/adjustments', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch adjustments')
    }
  }
)

export const fetchAdjustment = createAsyncThunk(
  'adjustments/fetchAdjustment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/adjustments/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch adjustment')
    }
  }
)

export const createAdjustment = createAsyncThunk(
  'adjustments/createAdjustment',
  async (adjustmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/adjustments', adjustmentData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create adjustment')
    }
  }
)

export const updateAdjustment = createAsyncThunk(
  'adjustments/updateAdjustment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/adjustments/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update adjustment')
    }
  }
)

const initialState = {
  items: [],
  currentAdjustment: null,
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
    type: ''
  }
}

const adjustmentSlice = createSlice({
  name: 'adjustments',
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
      .addCase(fetchAdjustments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAdjustments.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.adjustments || []
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          totalItems: action.payload.totalItems || 0,
          totalPages: action.payload.totalPages || 0
        }
      })
      .addCase(fetchAdjustments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      .addCase(fetchAdjustment.fulfilled, (state, action) => {
        state.currentAdjustment = action.payload.adjustment
      })
      
      .addCase(createAdjustment.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createAdjustment.fulfilled, (state, action) => {
        state.isCreating = false
        state.items.unshift(action.payload.adjustment)
      })
      .addCase(createAdjustment.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      
      .addCase(updateAdjustment.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateAdjustment.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.items.findIndex(item => item._id === action.payload.adjustment._id)
        if (index !== -1) {
          state.items[index] = action.payload.adjustment
        }
        state.currentAdjustment = action.payload.adjustment
      })
      .addCase(updateAdjustment.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
  }
})

export const { clearError, setFilters } = adjustmentSlice.actions
export default adjustmentSlice.reducer