import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Activity, ArrowRight, CheckCircle, Clock, XCircle, Package } from 'lucide-react'

const RecentOperations = () => {
  const { recentOperations } = useSelector((state) => state.dashboard)
  const [activeTab, setActiveTab] = useState('receipts')

  const getStatusConfig = (status) => {
    switch (status) {
      case 'done':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600 dark:text-green-400', 
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          label: 'Completed'
        }
      case 'ready':
        return { 
          icon: Package, 
          color: 'text-blue-600 dark:text-blue-400', 
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          label: 'Ready'
        }
      case 'waiting':
        return { 
          icon: Clock, 
          color: 'text-orange-600 dark:text-orange-400', 
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
          label: 'Waiting'
        }
      case 'cancelled':
        return { 
          icon: XCircle, 
          color: 'text-red-600 dark:text-red-400', 
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          label: 'Cancelled'
        }
      default:
        return { 
          icon: Clock, 
          color: 'text-slate-600 dark:text-slate-400', 
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          label: 'Draft'
        }
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, HH:mm')
    } catch {
      return 'Invalid date'
    }
  }

  const OperationRow = ({ operation, type, linkBase }) => {
    const statusConfig = getStatusConfig(operation.status)
    const StatusIcon = statusConfig.icon
    
    return (
      <Link 
        to={`${linkBase}/${operation._id}`}
        className="group block rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-4 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all hover:shadow-lg hover:scale-[1.01]"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${statusConfig.bg} flex-shrink-0`}>
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {operation.reference}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {type === 'receipts' && operation.supplier?.name}
                {type === 'deliveries' && operation.customer?.name}
                {type === 'transfers' && (
                  <span>
                    {operation.sourceLocation?.name} → {operation.destinationLocation?.name}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
              {statusConfig.label}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(operation.scheduledDate || operation.createdAt)}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>
      </Link>
    )
  }

  const tabs = [
    { id: 'receipts', label: 'Receipts', count: recentOperations.receipts?.length || 0 },
    { id: 'deliveries', label: 'Deliveries', count: recentOperations.deliveries?.length || 0 },
    { id: 'transfers', label: 'Transfers', count: recentOperations.transfers?.length || 0 },
  ]

  const getCurrentOperations = () => {
    return recentOperations[activeTab] || []
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 backdrop-blur-sm shadow-lg dark:shadow-none overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Operations
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Latest inventory movements
              </p>
            </div>
          </div>
          <Link 
            to="/operations/receipts"
            className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label} <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3">
          {getCurrentOperations().length > 0 ? (
            getCurrentOperations().slice(0, 5).map((operation, index) => (
              <div
                key={operation._id}
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  animation: 'fade-in 0.3s ease-out forwards'
                }}
              >
                <OperationRow
                  operation={operation}
                  type={activeTab}
                  linkBase={`/operations/${activeTab}`}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/50 mx-auto mb-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">No recent {activeTab}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecentOperations