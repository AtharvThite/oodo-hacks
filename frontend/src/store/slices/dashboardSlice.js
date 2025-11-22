import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dashboardService from '../services/dashboardService'

// Fetch dashboard KPIs
export const fetchDashboardKPIs = createAsyncThunk(
  'dashboard/fetchKPIs',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getKPIs()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch KPIs'
      )
    }
  }
)

// Fetch recent operations
export const fetchRecentOperations = createAsyncThunk(
  'dashboard/fetchRecentOperations',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getRecentOperations()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recent operations'
      )
    }
  }
)

// Fetch stock alerts
export const fetchStockAlerts = createAsyncThunk(
  'dashboard/fetchAlerts',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getAlerts()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch alerts'
      )
    }
  }
)

// Fetch move history
export const fetchMoveHistory = createAsyncThunk(
  'dashboard/fetchMoveHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await dashboardService.getMoveHistory(params)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch move history'
      )
    }
  }
)

const initialState = {
  kpis: {
    inventory: {
      totalProducts: 0,
      totalInStock: 0,
      lowStockCount: 0,
      outOfStockCount: 0
    },
    operations: {
      pendingReceipts: 0,
      pendingDeliveries: 0,
      pendingTransfers: 0
    },
    recentActivity: {
      receiptsLast30Days: 0,
      deliveriesLast30Days: 0
    }
  },
  recentOperations: {
    receipts: [],
    deliveries: [],
    transfers: []
  },
  alerts: [],
  moveHistory: [],
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch KPIs
      .addCase(fetchDashboardKPIs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardKPIs.fulfilled, (state, action) => {
        state.isLoading = false
        state.kpis = action.payload.data || action.payload
      })
      .addCase(fetchDashboardKPIs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch recent operations
      .addCase(fetchRecentOperations.fulfilled, (state, action) => {
        state.recentOperations = action.payload.data || action.payload
      })
      // Fetch alerts
      .addCase(fetchStockAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload.data || action.payload
      })
      // Fetch move history
      .addCase(fetchMoveHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMoveHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.moveHistory = action.payload.moves || []
      })
      .addCase(fetchMoveHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = dashboardSlice.actions
export default dashboardSlice.reducer