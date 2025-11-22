import api from './api'

const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/products?${queryString}`)
    return response.data
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Get product categories
  getCategories: async () => {
    const response = await api.get('/products/meta/categories')
    return response.data
  },

  // Get low stock products
  getLowStockProducts: async () => {
    const response = await api.get('/products/reports/low-stock')
    return response.data
  },
}

export default productService