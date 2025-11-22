import React from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Package,
  Truck,
  ArrowDownToLine,
  ArrowRightLeft,
  Sliders,
  History,
  FileText,
  Zap
} from 'lucide-react'

const QuickActions = () => {
  const actions = [
    {
      name: 'New Product',
      description: 'Add a new product to inventory',
      href: '/products/new',
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Create Receipt',
      description: 'Record incoming stock',
      href: '/operations/receipts/new',
      icon: ArrowDownToLine,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Create Delivery',
      description: 'Process outgoing stock',
      href: '/operations/deliveries/new',
      icon: Truck,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Internal Transfer',
      description: 'Move stock between locations',
      href: '/operations/transfers/new',
      icon: ArrowRightLeft,
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      name: 'Stock Adjustment',
      description: 'Adjust inventory levels',
      href: '/operations/adjustments/new',
      icon: Sliders,
      gradient: 'from-orange-500 to-yellow-500',
    },
  ]

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 backdrop-blur-sm shadow-lg dark:shadow-none overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Fast access to common tasks
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={action.name}
                to={action.href}
                className="group block relative rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-4 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all hover:shadow-lg hover:scale-[1.02] overflow-hidden"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  animation: 'fade-in 0.3s ease-out forwards'
                }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {action.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {action.description}
                    </p>
                  </div>
                  <Plus className="h-5 w-5 text-slate-400 group-hover:text-primary-500 group-hover:rotate-90 transition-all flex-shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700/50">
          <div className="grid grid-cols-1 gap-3">
            <Link 
              to="/operations/move-history"
              className="group flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-700/30 px-4 py-3 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-600">
                  <History className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Move History</span>
              </div>
              <Plus className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/products/reports/low-stock"
              className="group flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-700/30 px-4 py-3 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-600">
                  <FileText className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Stock Reports</span>
              </div>
              <Plus className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickActions