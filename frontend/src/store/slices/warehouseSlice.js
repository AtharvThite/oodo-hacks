import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import warehouseService from '../services/warehouseService'

// Fetch warehouses
export const fetchWarehouses = createAsyncThunk(
  'warehouses/fetchWarehouses',
  async (_, { rejectWithValue }) => {
    try {
      return await warehouseService.getWarehouses()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch warehouses'
      )
    }
  }
)

// Fetch locations
export const fetchLocations = createAsyncThunk(
  'warehouses/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      return await warehouseService.getLocations()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch locations'
      )
    }
  }
)

// Create warehouse
export const createWarehouse = createAsyncThunk(
  'warehouses/createWarehouse',
  async (warehouseData, { rejectWithValue }) => {
    try {
      return await warehouseService.createWarehouse(warehouseData)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create warehouse'
      )
    }
  }
)

// Update warehouse
export const updateWarehouse = createAsyncThunk(
  'warehouses/updateWarehouse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await warehouseService.updateWarehouse(id, data)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update warehouse'
      )
    }
  }
)

// Fetch warehouse
export const fetchWarehouse = createAsyncThunk(
  'warehouses/fetchWarehouse',
  async (id, { rejectWithValue }) => {
    try {
      return await warehouseService.getWarehouse(id)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch warehouse'
      )
    }
  }
)

// Create location
export const createLocation = createAsyncThunk(
  'warehouses/createLocation',
  async ({ warehouseId, locationData }, { rejectWithValue }) => {
    try {
      return await warehouseService.createLocation(warehouseId, locationData)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create location'
      )
    }
  }
)

const initialState = {
  items: [],
  warehouses: [],
  locations: [],
  currentWarehouse: null,
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
    search: ''
  },
}

const warehouseSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch warehouses
      .addCase(fetchWarehouses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle both array response and object response
        state.items = Array.isArray(action.payload) ? action.payload : (action.payload.warehouses || [])
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          totalItems: action.payload.totalItems || state.items.length,
          totalPages: action.payload.totalPages || 1
        }
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch locations
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.locations = action.payload
      })
      // Create warehouse
      .addCase(createWarehouse.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.isCreating = false
        const warehouse = action.payload.data || action.payload.warehouse || action.payload
        state.items.unshift(warehouse)
      })
      .addCase(createWarehouse.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      
      // Fetch single warehouse
      .addCase(fetchWarehouse.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchWarehouse.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentWarehouse = action.payload.data || action.payload.warehouse || action.payload
      })
      .addCase(fetchWarehouse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update warehouse
      .addCase(updateWarehouse.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.isUpdating = false
        const warehouse = action.payload.data || action.payload.warehouse || action.payload
        const index = state.items.findIndex(item => item._id === warehouse._id)
        if (index !== -1) {
          state.items[index] = warehouse
        }
        state.currentWarehouse = warehouse
      })
      .addCase(updateWarehouse.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      // Create location
      .addCase(createLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload)
      })
  },
})

export const { clearError, setFilters } = warehouseSlice.actions
export default warehouseSlice.reducer