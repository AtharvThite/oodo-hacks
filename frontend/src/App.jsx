import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './store/slices/authSlice'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import Dashboard from './components/dashboard/Dashboard'
import Products from './components/products/Products'
import ProductForm from './components/products/ProductForm'
import ProductDetail from './components/products/ProductDetail'
import Receipts from './components/operations/receipts/Receipts'
import ReceiptForm from './components/operations/receipts/ReceiptForm'
import ReceiptDetail from './components/operations/receipts/ReceiptDetail'
import Deliveries from './components/operations/deliveries/Deliveries'
import DeliveryForm from './components/operations/deliveries/DeliveryForm'
import DeliveryDetail from './components/operations/deliveries/DeliveryDetail'
import Transfers from './components/operations/transfers/Transfers'
import TransferForm from './components/operations/transfers/TransferForm'
import TransferDetail from './components/operations/transfers/TransferDetail'
import Adjustments from './components/operations/adjustments/Adjustments'
import AdjustmentForm from './components/operations/adjustments/AdjustmentForm'
import MoveHistory from './components/operations/MoveHistory'
import Warehouses from './components/warehouses/Warehouses'
import WarehouseForm from './components/warehouses/WarehouseForm'
import Profile from './components/profile/Profile'
import Settings from './components/settings/Settings'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading, token } = useSelector((state) => state.auth)

  useEffect(() => {
    // Try to get current user if token exists
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token, isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>

        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/forgot-password"
          element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/reset-password"
          element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/dashboard" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>

                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Products */}
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/new" element={<ProductForm />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/products/:id/edit" element={<ProductForm />} />

                  {/* Operations - Receipts */}
                  <Route path="/operations/receipts" element={<Receipts />} />
                  <Route path="/operations/receipts/new" element={<ReceiptForm />} />
                  <Route path="/operations/receipts/:id" element={<ReceiptDetail />} />

                  {/* Operations - Deliveries */}
                  <Route path="/operations/deliveries" element={<Deliveries />} />
                  <Route path="/operations/deliveries/new" element={<DeliveryForm />} />
                  <Route path="/operations/deliveries/:id" element={<DeliveryDetail />} />

                  {/* Operations - Transfers */}
                  <Route path="/operations/transfers" element={<Transfers />} />
                  <Route path="/operations/transfers/new" element={<TransferForm />} />
                  <Route path="/operations/transfers/:id" element={<TransferDetail />} />

                  {/* Operations - Adjustments */}
                  <Route path="/operations/adjustments" element={<Adjustments />} />
                  <Route path="/operations/adjustments/new" element={<AdjustmentForm />} />

                  {/* Move History */}
                  <Route path="/operations/move-history" element={<MoveHistory />} />

                  {/* Settings - Warehouses */}
                  <Route path="/settings/warehouses" element={<Warehouses />} />
                  <Route path="/settings/warehouses/new" element={<WarehouseForm />} />

                  {/* Profile & Settings */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Catch-all */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />

                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
