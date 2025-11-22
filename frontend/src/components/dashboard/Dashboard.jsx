import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardKPIs, fetchRecentOperations, fetchStockAlerts } from '../../store/slices/dashboardSlice'
import KPICards from './KPICards'
import RecentOperations from './RecentOperations'
import StockAlerts from './StockAlerts'
import QuickActions from './QuickActions'
import LoadingSpinner from '../common/LoadingSpinner'
import Card from '../common/Card'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.dashboard)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Fetch dashboard data
    dispatch(fetchDashboardKPIs())
    dispatch(fetchRecentOperations())
    dispatch(fetchStockAlerts())
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Stock Alerts */}
      <StockAlerts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Operations - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <RecentOperations />
        </div>
        
        {/* Quick Actions - Takes up 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

export default Dashboard