import React from 'react'
import { useSelector } from 'react-redux'
import {
  Package,
  AlertTriangle,
  XCircle,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp
} from 'lucide-react'

const KPICards = () => {
  const { kpis } = useSelector((state) => state.dashboard)

  const kpiData = [
    {
      name: 'Total Products',
      value: kpis.inventory?.totalProducts || 0,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/20',
      percentage: '+12%',
      trend: 'up'
    },
    {
      name: 'Total Stock Value',
      value: `${kpis.inventory?.totalInStock || 0}`,
      label: 'units',
      icon: ArrowDownToLine,
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/20',
      percentage: '+8%',
      trend: 'up'
    },
    {
      name: 'Low Stock Items',
      value: kpis.inventory?.lowStockCount || 0,
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-yellow-500',
      shadowColor: 'shadow-orange-500/20',
      percentage: '-3%',
      trend: 'down'
    },
    {
      name: 'Out of Stock',
      value: kpis.inventory?.outOfStockCount || 0,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      shadowColor: 'shadow-red-500/20',
      percentage: '-15%',
      trend: 'down'
    },
    {
      name: 'Pending Receipts',
      value: kpis.operations?.pendingReceipts || 0,
      icon: Truck,
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/20',
      percentage: '+5%',
      trend: 'up'
    },
    {
      name: 'Pending Deliveries',
      value: kpis.operations?.pendingDeliveries || 0,
      icon: ArrowUpFromLine,
      gradient: 'from-indigo-500 to-blue-500',
      shadowColor: 'shadow-indigo-500/20',
      percentage: '+7%',
      trend: 'up'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiData.map((item, index) => {
        const Icon = item.icon
        return (
          <div 
            key={item.name}
            className="group relative rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl dark:shadow-none hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  {item.name}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </div>
                  {item.label && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <TrendingUp className={`h-4 w-4 ${item.trend === 'up' ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                  <span className={`text-sm font-medium ${item.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {item.percentage}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">vs last week</span>
                </div>
              </div>
              
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg ${item.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-7 w-7 text-white" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min((item.value / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KPICards