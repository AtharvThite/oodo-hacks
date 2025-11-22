import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters } from '../../store/slices/productSlice'
import LoadingSpinner from '../common/LoadingSpinner'
import { Plus, Eye, Pencil, Package, Search, Filter, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

const Products = () => {
  const dispatch = useDispatch()
  const { items: products, isLoading, pagination, filters } = useSelector(state => state.products)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    category: filters.category || '',
  })

  useEffect(() => {
    dispatch(fetchProducts({ 
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

  const getStockStatusBadge = (product) => {
    if (product.currentStock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <AlertCircle className="h-3 w-3" />
          Out of Stock
        </span>
      )
    } else if (product.currentStock <= product.reorderPoint) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
          <TrendingDown className="h-3 w-3" />
          Low Stock
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
        <TrendingUp className="h-3 w-3" />
        In Stock
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your product inventory
              </p>
            </div>
          </div>
          <Link to="/products/new">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={localFilters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <select
              value={localFilters.category}
              onChange={(e) => {
                const category = e.target.value
                setLocalFilters(prev => ({ ...prev, category }))
                dispatch(setFilters({ category }))
              }}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
            </select>
            <div className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                {pagination.totalItems || 0} products
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product._id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      SKU: {product.sku}
                    </p>
                  </div>
                  {getStockStatusBadge(product)}
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Category</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Stock</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {product.currentStock || 0} {product.unitOfMeasure}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Unit Price</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      ${product.sellingPrice || 0}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Link to={`/products/${product._id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </Link>
                  <Link to={`/products/${product._id}/edit`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium hover:from-blue-600 hover:to-cyan-700 transition-all">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-12 shadow-lg text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No products found
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Get started by adding a new product.
                </p>
                <div className="mt-6">
                  <Link to="/products/new">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
                      <Plus className="h-5 w-5" />
                      Add Product
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products