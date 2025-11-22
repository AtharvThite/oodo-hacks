import api from './api'

const dashboardService = {
  // Get dashboard KPIs
  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis')
    return response.data
  },

  // Get recent operations
  getRecentOperations: async (limit = 10) => {
    const response = await api.get(`/dashboard/recent-operations?limit=${limit}`)
    return response.data
  },

  // Get stock alerts
  getAlerts: async () => {
    const response = await api.get('/dashboard/alerts')
    return response.data
  },
}

export default dashboardService