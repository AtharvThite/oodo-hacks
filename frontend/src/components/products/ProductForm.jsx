import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createProduct, updateProduct, fetchProduct } from '../../store/slices/productSlice'
import LoadingSpinner from '../common/LoadingSpinner'
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'

const ProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, isCreating, isUpdating, isLoading } = useSelector(state => state.products)
  
  const isEditing = Boolean(id)
  const isFormLoading = isCreating || isUpdating
  const isFetching = isEditing && isLoading

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchProduct(id))
    }
  }, [dispatch, id, isEditing])

  useEffect(() => {
    if (isEditing && currentProduct) {
      reset({
        name: currentProduct.name,
        sku: currentProduct.sku,
        description: currentProduct.description,
        category: currentProduct.category,
        unitOfMeasure: currentProduct.unitOfMeasure,
        costPrice: currentProduct.costPrice,
        sellingPrice: currentProduct.sellingPrice,
        minStockLevel: currentProduct.minStockLevel,
        maxStockLevel: currentProduct.maxStockLevel,
        reorderPoint: currentProduct.reorderPoint,
      })
    }
  }, [currentProduct, isEditing, reset])

  const onSubmit = async (data) => {
    try {
      // Convert SKU to uppercase
      const formData = {
        ...data,
        sku: data.sku?.toUpperCase() || ''
      }
      
      if (isEditing) {
        await dispatch(updateProduct({ id, data: formData })).unwrap()
        toast.success('Product updated successfully')
      } else {
        await dispatch(createProduct(formData)).unwrap()
        toast.success('Product created successfully')
      }
      navigate('/dashboard')
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Product' : 'New Product'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEditing ? 'Update product information' : 'Create a new product in your inventory'}
            </p>
          </div>
        </div>

        {isFetching && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-12 shadow-lg">
            <div className="flex items-center justify-center">
              <LoadingSpinner size="large" />
            </div>
          </div>
        )}

        {!isFetching && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                </span>
                Basic Information
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name (e.g., Apple iPhone 15)"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...register('name', {
                        required: 'Product name is required',
                        maxLength: {
                          value: 200,
                          message: 'Name cannot exceed 200 characters'
                        }
                      })}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., PROD-001 or APP-IPH-15"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...register('sku', {
                        required: 'SKU is required',
                        pattern: {
                          value: /^[A-Z0-9-_]+$/,
                          message: 'SKU can only contain uppercase letters, numbers, hyphens, and underscores'
                        }
                      })}
                    />
                    {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter product description..."
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    {...register('description')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Fruit, Electronics, Clothing"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...register('category', {
                        required: 'Category is required'
                      })}
                    />
                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Unit of Measure <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      {...register('unitOfMeasure', {
                        required: 'Unit of measure is required'
                      })}
                    >
                      <option value="">Select unit</option>
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="liters">Liters</option>
                      <option value="meters">Meters</option>
                      <option value="boxes">Boxes</option>
                      <option value="tons">Tons</option>
                    </select>
                    {errors.unitOfMeasure && <p className="mt-1 text-sm text-red-500">{errors.unitOfMeasure.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </span>
                Pricing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Cost Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    {...register('costPrice', {
                      min: {
                        value: 0,
                        message: 'Cost price cannot be negative'
                      }
                    })}
                  />
                  {errors.costPrice && <p className="mt-1 text-sm text-red-500">{errors.costPrice.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Selling Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    {...register('sellingPrice', {
                      min: {
                        value: 0,
                        message: 'Selling price cannot be negative'
                      }
                    })}
                  />
                  {errors.sellingPrice && <p className="mt-1 text-sm text-red-500">{errors.sellingPrice.message}</p>}
                </div>
              </div>
            </div>

            {/* Stock Levels */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </span>
                Stock Levels
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Stock Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    {...register('minStockLevel', {
                      min: {
                        value: 0,
                        message: 'Minimum stock level cannot be negative'
                      }
                    })}
                  />
                  {errors.minStockLevel && <p className="mt-1 text-sm text-red-500">{errors.minStockLevel.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Maximum Stock Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1000"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    {...register('maxStockLevel', {
                      min: {
                        value: 1,
                        message: 'Maximum stock level must be positive'
                      }
                    })}
                  />
                  {errors.maxStockLevel && <p className="mt-1 text-sm text-red-500">{errors.maxStockLevel.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Reorder Point
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="10"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    {...register('reorderPoint', {
                      min: {
                        value: 0,
                        message: 'Reorder point cannot be negative'
                      }
                    })}
                  />
                  {errors.reorderPoint && <p className="mt-1 text-sm text-red-500">{errors.reorderPoint.message}</p>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isFormLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
              >
                {isFormLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  isEditing ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProductForm