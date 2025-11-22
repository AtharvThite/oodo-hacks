import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createTransfer, updateTransfer, fetchTransfer } from '../../../store/slices/transferSlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import { Plus, Trash2, ArrowRightLeft, Package } from 'lucide-react'

const TransferForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentTransfer, isCreating, isUpdating } = useSelector(state => state.transfers)
  const { items: warehouses } = useSelector(state => state.warehouses)
  
  const isEditing = Boolean(id)
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sourceWarehouse: '',
      sourceLocation: '',
      destinationWarehouse: '',
      destinationLocation: '',
      scheduledDate: '',
      reference: '',
      transferType: 'internal',
      notes: '',
      products: [{ product: '', quantity: 0, notes: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  })

  const watchedSourceWarehouse = watch('sourceWarehouse')
  const watchedDestWarehouse = watch('destinationWarehouse')

  // Mock locations based on selected warehouse
  const getSourceLocations = () => {
    if (!watchedSourceWarehouse) return []
    return [
      { id: `${watchedSourceWarehouse}_storage`, name: 'Storage' },
      { id: `${watchedSourceWarehouse}_picking`, name: 'Picking' },
      { id: `${watchedSourceWarehouse}_packing`, name: 'Packing' },
      { id: `${watchedSourceWarehouse}_shipping`, name: 'Shipping' }
    ]
  }

  const getDestLocations = () => {
    if (!watchedDestWarehouse) return []
    return [
      { id: `${watchedDestWarehouse}_storage`, name: 'Storage' },
      { id: `${watchedDestWarehouse}_receiving`, name: 'Receiving' },
      { id: `${watchedDestWarehouse}_quality`, name: 'Quality Check' },
      { id: `${watchedDestWarehouse}_unpacking`, name: 'Unpacking' }
    ]
  }

  useEffect(() => {
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchTransfer(id))
    }
  }, [dispatch, id, isEditing])

  useEffect(() => {
    if (isEditing && currentTransfer) {
      reset({
        sourceWarehouse: currentTransfer.sourceWarehouse || '',
        sourceLocation: currentTransfer.sourceLocation || '',
        destinationWarehouse: currentTransfer.destinationWarehouse || '',
        destinationLocation: currentTransfer.destinationLocation || '',
        scheduledDate: currentTransfer.scheduledDate?.split('T')[0] || '',
        reference: currentTransfer.reference || '',
        transferType: currentTransfer.transferType || 'internal',
        notes: currentTransfer.notes || '',
        products: currentTransfer.products?.map(item => ({
          product: item.product?._id || item.product,
          quantity: item.quantity,
          notes: item.notes || ''
        })) || [{ product: '', quantity: 0, notes: '' }]
      })
    }
  }, [currentTransfer, isEditing, reset])

  const onSubmit = async (data) => {
    try {
      // Validate at least one product exists
      if (!data.products || data.products.length === 0 || data.products.every(p => !p.product)) {
        toast.error('At least one product is required')
        return
      }

      const formattedData = {
        reference: data.reference,
        sourceLocation: data.sourceLocation,
        destinationLocation: data.destinationLocation,
        scheduledDate: data.scheduledDate,
        transferType: data.transferType,
        notes: data.notes,
        products: data.products.map(item => ({
          product: item.product,
          quantity: parseFloat(item.quantity),
          notes: item.notes || ''
        }))
      }

      if (isEditing) {
        await dispatch(updateTransfer({ id, data: formattedData })).unwrap()
        toast.success('Transfer updated successfully')
      } else {
        await dispatch(createTransfer(formattedData)).unwrap()
        toast.success('Transfer created successfully')
      }
      navigate('/operations/transfers')
    } catch (error) {
      toast.error(error?.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30">
            <ArrowRightLeft className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Transfer' : 'New Transfer'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEditing ? 'Update transfer information' : 'Create a new warehouse transfer'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Transfer Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">1</span>
              </span>
              Transfer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Source Warehouse (for location)
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('sourceWarehouse')}
                >
                  <option value="">Select warehouse</option>
                  {Array.isArray(warehouses) && warehouses.map((warehouse) => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Source Location <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('sourceLocation', {
                    required: 'Source location is required'
                  })}
                >
                  <option value="">Select location</option>
                  {getSourceLocations().map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.sourceLocation && <p className="mt-1 text-sm text-red-500">{errors.sourceLocation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Destination Warehouse (for location)
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('destinationWarehouse')}
                >
                  <option value="">Select warehouse</option>
                  {Array.isArray(warehouses) && warehouses.map((warehouse) => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Destination Location <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('destinationLocation', {
                    required: 'Destination location is required'
                  })}
                >
                  <option value="">Select location</option>
                  {getDestLocations().map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.destinationLocation && <p className="mt-1 text-sm text-red-500">{errors.destinationLocation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Scheduled Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('scheduledDate', { required: 'Scheduled date is required' })}
                />
                {errors.scheduledDate && <p className="mt-1 text-sm text-red-500">{errors.scheduledDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Reference <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., TRF-001"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('reference', { required: 'Reference is required' })}
                />
                {errors.reference && <p className="mt-1 text-sm text-red-500">{errors.reference.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Transfer Type
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  {...register('transferType')}
                >
                  <option value="internal">Internal</option>
                  <option value="inter-warehouse">Inter-warehouse</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Notes
              </label>
              <textarea
                rows="3"
                placeholder="Add any additional notes..."
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                {...register('notes')}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">2</span>
                </span>
                Products
              </h3>
              <button
                type="button"
                onClick={() => append({ product: '', quantity: 0, notes: '' })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium text-sm transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Product {index + 1}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Product SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., IPH15PM256"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        {...register(`products.${index}.product`, {
                          required: 'Product is required'
                        })}
                      />
                      {errors.products?.[index]?.product && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].product.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        {...register(`products.${index}.quantity`, {
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Quantity must be at least 1' }
                        })}
                      />
                      {errors.products?.[index]?.quantity && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].quantity.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Additional notes for this product..."
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      {...register(`products.${index}.notes`)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {fields.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Package className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No products added yet</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click "Add Product" to get started</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              type="button"
              onClick={() => navigate('/operations/transfers')}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditing ? 'Update Transfer' : 'Create Transfer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransferForm