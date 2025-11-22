import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../services/productService'

// Fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      return await productService.getProducts(params)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      )
    }
  }
)

// Fetch single product
export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      return await productService.getProduct(id)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      )
    }
  }
)

// Create product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      return await productService.createProduct(productData)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      )
    }
  }
)

// Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await productService.updateProduct(id, data)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      )
    }
  }
)

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      )
    }
  }
)

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getCategories()
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      )
    }
  }
)

const initialState = {
  items: [],
  currentProduct: null,
  categories: [],
  pagination: {
    current: 1,
    total: 0,
    totalItems: 0
  },
  filters: {
    search: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'asc'
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false
        // Handle both response formats: { data: product } or { success: true, data: product }
        state.currentProduct = action.payload.data || action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isCreating = false
        const product = action.payload.data || action.payload
        state.items.unshift(product)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isUpdating = false
        const product = action.payload.data || action.payload
        const index = state.items.findIndex(item => item._id === product._id)
        if (index !== -1) {
          state.items[index] = product
        }
        if (state.currentProduct?._id === product._id) {
          state.currentProduct = product
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload)
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.data || action.payload
      })
  },
})

export const { clearError, setFilters, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer