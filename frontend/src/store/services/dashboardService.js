import api from './api'

const dashboardService = {
  // Get dashboard KPIs
  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis')
    return response.data.data
  },

  // Get recent operations
  getRecentOperations: async (limit = 10) => {
    const response = await api.get(`/dashboard/recent-operations?limit=${limit}`)
    return response.data.data
  },

  // Get stock alerts
  getAlerts: async () => {
    const response = await api.get('/dashboard/alerts')
    return response.data.data
  },

  // Get move history
  getMoveHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/dashboard/move-history?${queryString}`)
    return response.data
  },
}

export default dashboardService