import api from './api'

const warehouseService = {
  // Get all warehouses
  getWarehouses: async () => {
    const response = await api.get('/warehouses')
    return response.data
  },

  // Get single warehouse with locations
  getWarehouse: async (id) => {
    const response = await api.get(`/warehouses/${id}`)
    return response.data
  },

  // Create warehouse
  createWarehouse: async (warehouseData) => {
    const response = await api.post('/warehouses', warehouseData)
    return response.data
  },

  // Get all locations
  getLocations: async () => {
    const response = await api.get('/warehouses/locations/all')
    return response.data
  },

  // Create location
  createLocation: async (warehouseId, locationData) => {
    const response = await api.post(`/warehouses/${warehouseId}/locations`, locationData)
    return response.data
  },
}

export default warehouseService