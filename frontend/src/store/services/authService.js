import api from './api'

const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    
    // Store token if present
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    
    return response.data
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    
    // Store token if present
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    localStorage.removeItem('token')
    return response.data
  },
}

export default authService