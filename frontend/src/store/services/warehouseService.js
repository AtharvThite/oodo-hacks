import api from './api'

const warehouseService = {
  // Get all warehouses
  getWarehouses: async () => {
    const response = await api.get('/warehouses')
    return response.data.data || []
  },

  // Get single warehouse with locations
  getWarehouse: async (id) => {
    const response = await api.get(`/warehouses/${id}`)
    return response.data.data || response.data
  },

  // Create warehouse
  createWarehouse: async (warehouseData) => {
    const response = await api.post('/warehouses', warehouseData)
    return response.data.data || response.data
  },

  // Update warehouse
  updateWarehouse: async (id, warehouseData) => {
    const response = await api.put(`/warehouses/${id}`, warehouseData)
    return response.data
  },

  // Delete warehouse
  deleteWarehouse: async (id) => {
    const response = await api.delete(`/warehouses/${id}`)
    return response.data
  },

  // Get all locations
  getLocations: async () => {
    const response = await api.get('/warehouses/locations/all')
    return response.data.data || []
  },

  // Create location
  createLocation: async (warehouseId, locationData) => {
    const response = await api.post(`/warehouses/${warehouseId}/locations`, locationData)
    return response.data.data || response.data
  },
}

export default warehouseService