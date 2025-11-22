import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReceipts, setFilters } from '../../../store/slices/receiptSlice'
import LoadingSpinner from '../../common/LoadingSpinner'
import { Plus, Eye, FileText, Package, Search, Filter, ArrowRight, PackagePlus } from 'lucide-react'

const Receipts = () => {
  const dispatch = useDispatch()
  const { items: receipts, isLoading, pagination, filters } = useSelector(state => state.receipts)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    status: filters.status || '',
  })

  useEffect(() => {
    dispatch(fetchReceipts({ 
      page: 1, 
      limit: 20,
      ...filters 
    }))
  }, [dispatch, filters])

  const handleSearch = (e) => {
    const search = e.target.value
    setLocalFilters(prev => ({ ...prev, search }))
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      dispatch(setFilters({ search }))
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }

  const getStatusConfig = (status) => {
    const configs = {
      draft: { 
        bg: 'bg-slate-500/10', 
        text: 'text-slate-600 dark:text-slate-400', 
        border: 'border-slate-500/20', 
        label: 'Draft' 
      },
      waiting: { 
        bg: 'bg-yellow-500/10', 
        text: 'text-yellow-600 dark:text-yellow-400', 
        border: 'border-yellow-500/20', 
        label: 'Waiting' 
      },
      ready: { 
        bg: 'bg-blue-500/10', 
        text: 'text-blue-600 dark:text-blue-400', 
        border: 'border-blue-500/20', 
        label: 'Ready' 
      },
      done: { 
        bg: 'bg-green-500/10', 
        text: 'text-green-600 dark:text-green-400', 
        border: 'border-green-500/20', 
        label: 'Done' 
      },
      cancelled: { 
        bg: 'bg-red-500/10', 
        text: 'text-red-600 dark:text-red-400', 
        border: 'border-red-500/20', 
        label: 'Cancelled' 
      }
    }
    return configs[status] || configs.draft
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading receipts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                <PackagePlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Receipts</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manage incoming stock receipts
                </p>
              </div>
            </div>
          </div>
          <Link to="/operations/receipts/new">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105">
              <Plus className="h-5 w-5" />
              New Receipt
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search receipts..."
                value={localFilters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={localFilters.status}
              onChange={(e) => {
                const status = e.target.value
                setLocalFilters(prev => ({ ...prev, status }))
                dispatch(setFilters({ status }))
              }}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="ready">Ready</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            {/* Count */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {pagination.totalItems || 0} receipts
              </span>
            </div>
          </div>
        </div>

        {/* Receipts Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {receipts && receipts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Receipt #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Warehouse
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Scheduled Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {receipts.map((receipt, index) => {
                    const statusConfig = getStatusConfig(receipt.status)
                    return (
                      <tr 
                        key={receipt._id} 
                        className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.05 * index}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                              <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {receipt.reference || receipt.receiptNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {receipt.supplier?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {receipt.warehouse?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.text.replace('text-', 'bg-')}`} />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {new Date(receipt.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                          ${receipt.totalValue?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link to={`/operations/receipts/${receipt._id}`}>
                            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 font-medium text-sm transition-all group-hover:scale-105">
                              <Eye className="h-4 w-4" />
                              View
                              <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 mb-4">
                <FileText className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No receipts found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Get started by creating your first receipt
              </p>
              <Link to="/operations/receipts/new">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105">
                  <Plus className="h-5 w-5" />
                  Create Receipt
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Receipts