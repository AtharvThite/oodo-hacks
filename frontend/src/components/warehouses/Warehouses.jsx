import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWarehouses, setFilters } from '../../store/slices/warehouseSlice'
import LoadingSpinner from '../common/LoadingSpinner'
import { Plus, Eye, Pencil, Warehouse, Search, MapPin, CheckCircle, XCircle, Building2 } from 'lucide-react'

const Warehouses = () => {
  const dispatch = useDispatch()
  const { items: warehouses, isLoading, pagination, filters } = useSelector(state => state.warehouses)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
  })

  useEffect(() => {
    dispatch(fetchWarehouses({ 
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading warehouses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
              <Warehouse className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Warehouses</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your warehouse locations and storage facilities
              </p>
            </div>
          </div>
          <Link to="/warehouses/new">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105">
              <Plus className="h-5 w-5" />
              Add Warehouse
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search warehouses by name or code..."
                value={localFilters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {pagination.totalItems || 0} warehouses
              </span>
            </div>
          </div>
        </div>

        {/* Warehouses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses && warehouses.length > 0 ? (
            warehouses.map((warehouse, index) => (
              <div
                key={warehouse._id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:scale-110 transition-all">
                      <Warehouse className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {warehouse.name}
                      </h3>
                      <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
                        {warehouse.shortCode}
                      </p>
                    </div>
                  </div>
                  {warehouse.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </span>
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-3 mb-5">
                  {/* Address */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                    <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Address</p>
                      <p className="text-sm text-slate-900 dark:text-white line-clamp-2">
                        {warehouse.address || 'No address specified'}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Code</p>
                      <p className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono truncate">
                        {warehouse.shortCode}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {warehouse.isActive ? '✓ Ready' : '✗ Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/warehouses/${warehouse._id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </Link>
                  <Link to={`/warehouses/${warehouse._id}/edit`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-16 shadow-lg text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 mb-4">
                  <Warehouse className="h-10 w-10 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No warehouses found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Get started by adding your first warehouse location
                </p>
                <Link to="/warehouses/new">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all hover:scale-105">
                    <Plus className="h-5 w-5" />
                    Add Warehouse
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Warehouses