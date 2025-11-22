import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dashboardService from '../../store/services/dashboardService'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'
import { History, Search, Filter, TrendingUp, TrendingDown, Package, ArrowRight, ArrowLeft } from 'lucide-react'

const MoveHistory = () => {
  const [moves, setMoves] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, total: 1, totalItems: 0 })
  const [filters, setFilters] = useState({
    search: '',
    moveType: '',
    page: 1,
    limit: 50
  })

  useEffect(() => {
    fetchMoveHistory()
  }, [filters])

  const fetchMoveHistory = async () => {
    setIsLoading(true)
    try {
      const params = {}
      if (filters.moveType) params.moveType = filters.moveType
      if (filters.search) params.product = filters.search
      params.page = filters.page
      params.limit = filters.limit

      const response = await dashboardService.getMoveHistory(params)
      
      // Handle response structure
      if (response.success && response.data) {
        setMoves(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else if (Array.isArray(response)) {
        setMoves(response)
      } else {
        setMoves([])
      }
    } catch (error) {
      console.error('Error fetching move history:', error)
      toast.error('Failed to fetch move history')
      setMoves([])
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeConfig = (type) => {
    const configs = {
      'in': { 
        bg: 'bg-green-500/10', 
        text: 'text-green-600 dark:text-green-400', 
        border: 'border-green-500/20', 
        label: 'In' 
      },
      'out': { 
        bg: 'bg-purple-500/10', 
        text: 'text-purple-600 dark:text-purple-400', 
        border: 'border-purple-500/20', 
        label: 'Out' 
      },
      'internal': { 
        bg: 'bg-indigo-500/10', 
        text: 'text-indigo-600 dark:text-indigo-400', 
        border: 'border-indigo-500/20', 
        label: 'Internal' 
      },
      'adjustment': { 
        bg: 'bg-orange-500/10', 
        text: 'text-orange-600 dark:text-orange-400', 
        border: 'border-orange-500/20', 
        label: 'Adjustment' 
      }
    }
    return configs[type] || { 
      bg: 'bg-slate-500/10', 
      text: 'text-slate-600 dark:text-slate-400', 
      border: 'border-slate-500/20', 
      label: 'Unknown' 
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      done: { bg: 'bg-green-500/10', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/20' },
      draft: { bg: 'bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-500/20' },
      waiting: { bg: 'bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-500/20' },
      ready: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
      cancelled: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' }
    }
    return configs[status] || configs.draft
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading movement history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30">
            <History className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Stock Movement History</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track all stock movements across your warehouses</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <select
              value={filters.moveType}
              onChange={(e) => setFilters(prev => ({ ...prev, moveType: e.target.value, page: 1 }))}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">All Types</option>
              <option value="in">In</option>
              <option value="out">Out</option>
              <option value="internal">Internal</option>
              <option value="adjustment">Adjustment</option>
            </select>
            <div className="flex items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {pagination.totalItems || moves.length || 0} total movements
              </span>
            </div>
          </div>
        </div>

        {/* Movement History Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {moves && moves.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {moves.map((move, index) => {
                    const typeConfig = getTypeConfig(move.moveType)
                    const statusConfig = getStatusConfig(move.status)
                    const isIncoming = move.moveType === 'in' || move.moveType === 'adjustment'
                    return (
                      <tr 
                        key={move._id || index} 
                        className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${0.05 * index}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          {new Date(move.scheduledDate || move.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {move.reference || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {move.product?.name || 'N/A'}
                            </span>
                            <br />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {move.product?.sku || ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${typeConfig.text.replace('text-', 'bg-')}`} />
                            {typeConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            {move.sourceLocation?.name || move.sourceLocation || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            {move.destinationLocation?.name || move.destinationLocation || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                            isIncoming ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {isIncoming ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {move.moveType === 'in' ? '+' : move.moveType === 'out' ? '-' : ''}
                            {move.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.text.replace('text-', 'bg-')}`} />
                            {move.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 mb-4">
                <Package className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No movement history found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Stock movements will appear here as operations are processed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MoveHistory