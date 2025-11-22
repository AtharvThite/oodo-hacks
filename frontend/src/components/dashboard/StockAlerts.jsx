import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AlertTriangle, XCircle, ArrowRight, Bell } from 'lucide-react'

const StockAlerts = () => {
  const { alerts } = useSelector((state) => state.dashboard)

  // Ensure alerts is always an array
  const safeAlerts = Array.isArray(alerts) ? alerts : []

  if (safeAlerts.length === 0) {
    return null
  }

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-950/20 dark:to-yellow-950/20 backdrop-blur-sm p-6 shadow-lg dark:shadow-none">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg shadow-orange-500/30 animate-pulse">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Stock Alerts
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {safeAlerts.length} items require attention
            </p>
          </div>
        </div>
        <Link 
          to="/products?filter=low-stock"
          className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-all"
        >
          View All
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {safeAlerts.slice(0, 3).map((alert, index) => (
          <div 
            key={alert.product.id} 
            className="group relative rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 p-4 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all hover:shadow-lg hover:scale-[1.01]"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            {/* Alert indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${alert.type === 'out_of_stock' ? 'bg-gradient-to-b from-red-500 to-rose-500' : 'bg-gradient-to-b from-orange-500 to-yellow-500'}`} />
            
            <div className="flex items-center justify-between ml-3">
              <div className="flex items-center gap-4 flex-1">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${alert.type === 'out_of_stock' ? 'bg-gradient-to-br from-red-500/20 to-rose-500/20' : 'bg-gradient-to-br from-orange-500/20 to-yellow-500/20'} flex-shrink-0`}>
                  {alert.type === 'out_of_stock' ? (
                    <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {alert.product.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    SKU: {alert.product.sku}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {alert.currentStock}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    / {alert.reorderPoint} min
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${alert.type === 'out_of_stock' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'}`}>
                  {alert.type === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length > 3 && (
        <div className="mt-4 text-center">
          <Link 
            to="/products?filter=alerts" 
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            View {alerts.length - 3} more alerts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default StockAlerts