import api from './api'

const operationsService = {
  // Receipts
  receipts: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/receipts?${queryString}`)
      return response.data
    },
    
    getById: async (id) => {
      const response = await api.get(`/receipts/${id}`)
      return response.data
    },
    
    create: async (receiptData) => {
      const response = await api.post('/receipts', receiptData)
      return response.data
    },
    
    updateQuantities: async (id, quantities) => {
      const response = await api.put(`/receipts/${id}/quantities`, { products: quantities })
      return response.data
    },
    
    validate: async (id) => {
      const response = await api.put(`/receipts/${id}/validate`)
      return response.data
    },
  },

  // Deliveries
  deliveries: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/deliveries?${queryString}`)
      return response.data
    },
    
    getById: async (id) => {
      const response = await api.get(`/deliveries/${id}`)
      return response.data
    },
    
    create: async (deliveryData) => {
      const response = await api.post('/deliveries', deliveryData)
      return response.data
    },
    
    updateQuantities: async (id, quantities) => {
      const response = await api.put(`/deliveries/${id}/quantities`, { products: quantities })
      return response.data
    },
    
    validate: async (id) => {
      const response = await api.put(`/deliveries/${id}/validate`)
      return response.data
    },
  },

  // Transfers
  transfers: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/transfers?${queryString}`)
      return response.data
    },
    
    getById: async (id) => {
      const response = await api.get(`/transfers/${id}`)
      return response.data
    },
    
    create: async (transferData) => {
      const response = await api.post('/transfers', transferData)
      return response.data
    },
    
    updateQuantities: async (id, quantities) => {
      const response = await api.put(`/transfers/${id}/quantities`, { products: quantities })
      return response.data
    },
    
    validate: async (id) => {
      const response = await api.put(`/transfers/${id}/validate`)
      return response.data
    },
  },

  // Adjustments
  adjustments: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      const response = await api.get(`/adjustments?${queryString}`)
      return response.data
    },
    
    getById: async (id) => {
      const response = await api.get(`/adjustments/${id}`)
      return response.data
    },
    
    create: async (adjustmentData) => {
      const response = await api.post('/adjustments', adjustmentData)
      return response.data
    },
    
    approve: async (id) => {
      const response = await api.put(`/adjustments/${id}/approve`)
      return response.data
    },
  },
}

export default operationsService