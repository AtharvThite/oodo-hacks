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

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    localStorage.removeItem('token')
    return response.data
  },

  // Send OTP
  sendOTP: async (email, purpose = 'registration') => {
    const response = await api.post('/auth/send-otp', { email, purpose })
    return response.data
  },

  // Verify OTP
  verifyOTP: async (email, otp, purpose = 'registration') => {
    const response = await api.post('/auth/verify-otp', { email, otp, purpose })
    return response.data
  },

  // Resend OTP
  resendOTP: async (email, purpose = 'registration') => {
    const response = await api.post('/auth/resend-otp', { email, purpose })
    return response.data
  },
}

export default authService