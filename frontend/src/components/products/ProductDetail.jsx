import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../../store/slices/productSlice'
import LoadingSpinner from '../common/LoadingSpinner'
import { Pencil, ArrowLeft, Package, TrendingUp, TrendingDown, AlertCircle, DollarSign, Box, History } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProduct: product, isLoading } = useSelector(state => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Product not found</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const getStockStatusBadge = () => {
    if (product.currentStock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          Out of Stock
        </span>
      )
    } else if (product.currentStock <= product.reorderPoint) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
          <TrendingDown className="h-4 w-4" />
          Low Stock
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
        <TrendingUp className="h-4 w-4" />
        In Stock
      </span>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {product.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  SKU: {product.sku}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStockStatusBadge()}
            <Link to={`/products/${id}/edit`}>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/30">
                <Pencil className="h-5 w-5" />
                Edit Product
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Product Information
              </h3>
              
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Name</dt>
                  <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">{product.name}</dd>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">SKU</dt>
                  <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">{product.sku}</dd>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Category</dt>
                  <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">{product.category}</dd>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Unit of Measure</dt>
                  <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white capitalize">{product.unitOfMeasure}</dd>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Cost Price
                  </dt>
                  <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">${product.costPrice || 0}</dd>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Selling Price
                  </dt>
                  <dd className="mt-1 text-base font-medium text-slate-900 dark:text-white">${product.sellingPrice || 0}</dd>
                </div>
              </dl>
              
              {product.description && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Description</dt>
                  <dd className="mt-2 text-sm text-slate-900 dark:text-white">{product.description}</dd>
                </div>
              )}
            </div>

            {/* Stock History */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Recent Stock Movements
              </h3>
              
              {product.stockHistory && product.stockHistory.length > 0 ? (
                <div className="space-y-3">
                  {product.stockHistory.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {movement.reference}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {movement.location?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${movement.type === 'in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(movement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                    <History className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No stock movements yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stock Information Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Stock Information
              </h3>
              
              <dl className="space-y-5">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                  <dt className="text-sm font-semibold text-blue-700 dark:text-blue-400">Current Stock</dt>
                  <dd className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-300">
                    {product.currentStock || 0}
                    <span className="text-base font-medium text-blue-600 dark:text-blue-400 ml-2">
                      {product.unitOfMeasure}
                    </span>
                  </dd>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Reorder Point</dt>
                  <dd className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {product.reorderPoint}
                  </dd>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Min Stock Level</dt>
                  <dd className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {product.minStockLevel || 0}
                  </dd>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Max Stock Level</dt>
                  <dd className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    {product.maxStockLevel || 0}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail