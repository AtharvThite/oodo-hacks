import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransfers, setFilters } from '../../../store/slices/transferSlice'
import LoadingSpinner from '../../common/LoadingSpinner'
import { Plus, Eye, ArrowRightLeft, Search, Filter, ArrowRight, Package } from 'lucide-react'

const Transfers = () => {
  const dispatch = useDispatch()
  const { items: transfers, isLoading, pagination, filters } = useSelector(state => state.transfers)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    status: filters.status || '',
  })

  useEffect(() => {
    dispatch(fetchTransfers({ 
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

  const getTransferTypeBadge = (type) => {
    return type === 'internal' 
      ? { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' }
      : { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading transfers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30">
                <ArrowRightLeft className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transfers</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manage stock transfers between locations
                </p>
              </div>
            </div>
          </div>
          <Link to="/operations/transfers/new">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105">
              <Plus className="h-5 w-5" />
              New Transfer
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
                placeholder="Search transfers..."
                value={localFilters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="waiting">Waiting</option>
              <option value="ready">Ready</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            {/* Count */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {pagination.totalItems || 0} transfers
              </span>
            </div>
          </div>
        </div>

        {/* Transfers Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {transfers && transfers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      From Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      To Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Scheduled Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {transfers.map((transfer, index) => {
                    const statusConfig = getStatusConfig(transfer.status)
                    const typeBadge = getTransferTypeBadge(transfer.transferType)
                    return (
                      <tr 
                        key={transfer._id} 
                        className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.05 * index}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                              <ArrowRightLeft className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {transfer.reference}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {transfer.sourceLocation || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {transfer.destinationLocation || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}>
                            {transfer.transferType || 'internal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.text.replace('text-', 'bg-')}`} />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {new Date(transfer.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {transfer.products?.length || 0} item(s)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link to={`/operations/transfers/${transfer._id}`}>
                            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium text-sm transition-all group-hover:scale-105">
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 mb-4">
                <ArrowRightLeft className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No transfers found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Get started by creating your first transfer
              </p>
              <Link to="/operations/transfers/new">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105">
                  <Plus className="h-5 w-5" />
                  Create Transfer
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Transfers