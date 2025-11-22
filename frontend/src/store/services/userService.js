import api from './api'

const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/users?${queryString}`)
    return response.data
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData)
    return response.data
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role })
    return response.data
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  },

  // Deactivate user
  deactivateUser: async (userId) => {
    const response = await api.put(`/users/${userId}/deactivate`, {})
    return response.data
  },
}

export default userService
