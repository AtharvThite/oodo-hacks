import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardKPIs, fetchRecentOperations, fetchStockAlerts } from '../../store/slices/dashboardSlice'
import KPICards from './KPICards'
import RecentOperations from './RecentOperations'
import StockAlerts from './StockAlerts'
import QuickActions from './QuickActions'
import LoadingSpinner from '../common/LoadingSpinner'
import { Activity, Sparkles } from 'lucide-react'

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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Header with Animation */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/30 animate-pulse">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Welcome back, <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.name}</span>!
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 ml-13">
            <Activity className="h-4 w-4" />
            <p className="text-base">
              Here's what's happening with your inventory today.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <KPICards />
        </div>

        {/* Stock Alerts */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <StockAlerts />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* Recent Operations - Takes up 2 columns */}
          <div className="xl:col-span-2">
            <RecentOperations />
          </div>
          
          {/* Quick Actions - Takes up 1 column */}
          <div className="xl:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard