import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

// Async thunks
export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetchDeliveries',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/deliveries', { params })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch deliveries')
    }
  }
)

export const fetchDelivery = createAsyncThunk(
  'deliveries/fetchDelivery',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/deliveries/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch delivery')
    }
  }
)

export const createDelivery = createAsyncThunk(
  'deliveries/createDelivery',
  async (deliveryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/deliveries', deliveryData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create delivery')
    }
  }
)

export const updateDelivery = createAsyncThunk(
  'deliveries/updateDelivery',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/deliveries/${id}`, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update delivery')
    }
  }
)

const initialState = {
  items: [],
  currentDelivery: null,
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

const deliverySlice = createSlice({
  name: 'deliveries',
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
      .addCase(fetchDeliveries.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.deliveries || []
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          totalItems: action.payload.totalItems || 0,
          totalPages: action.payload.totalPages || 0
        }
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      .addCase(fetchDelivery.fulfilled, (state, action) => {
        state.currentDelivery = action.payload.delivery
      })
      
      .addCase(createDelivery.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createDelivery.fulfilled, (state, action) => {
        state.isCreating = false
        state.items.unshift(action.payload.delivery)
      })
      .addCase(createDelivery.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      
      .addCase(updateDelivery.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateDelivery.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.items.findIndex(item => item._id === action.payload.delivery._id)
        if (index !== -1) {
          state.items[index] = action.payload.delivery
        }
        state.currentDelivery = action.payload.delivery
      })
      .addCase(updateDelivery.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
  }
})

export const { clearError, setFilters } = deliverySlice.actions
export default deliverySlice.reducer