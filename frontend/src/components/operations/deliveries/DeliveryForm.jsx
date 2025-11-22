import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createDelivery, updateDelivery, fetchDelivery } from '../../../store/slices/deliverySlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import { Plus, Trash2, Truck, Package } from 'lucide-react'

const DeliveryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentDelivery, isCreating, isUpdating } = useSelector(state => state.deliveries)
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
      customer: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      warehouse: '',
      sourceLocation: '',
      scheduledDate: '',
      reference: '',
      notes: '',
      products: [{ product: '', requestedQuantity: 0, unitPrice: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  })

  const watchedProducts = watch('products')
  const watchedWarehouse = watch('warehouse')

  // Mock locations based on selected warehouse
  const getLocations = () => {
    if (!watchedWarehouse) return []
    return [
      { id: `${watchedWarehouse}_storage`, name: 'Storage' },
      { id: `${watchedWarehouse}_picking`, name: 'Picking' },
      { id: `${watchedWarehouse}_packing`, name: 'Packing' },
      { id: `${watchedWarehouse}_shipping`, name: 'Shipping' }
    ]
  }

  useEffect(() => {
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchDelivery(id))
    }
  }, [dispatch, id, isEditing])

  useEffect(() => {
    if (isEditing && currentDelivery) {
      reset({
        customer: {
          name: currentDelivery.customer?.name || '',
          email: currentDelivery.customer?.email || '',
          phone: currentDelivery.customer?.phone || '',
          address: currentDelivery.customer?.address || ''
        },
        warehouse: currentDelivery.warehouse?._id || currentDelivery.warehouse || '',
        sourceLocation: currentDelivery.sourceLocation || '',
        scheduledDate: currentDelivery.scheduledDate?.split('T')[0] || '',
        reference: currentDelivery.reference || '',
        notes: currentDelivery.notes || '',
        products: currentDelivery.products || [{ product: '', requestedQuantity: 0, unitPrice: 0 }]
      })
    }
  }, [currentDelivery, isEditing, reset])

  const calculateTotal = () => {
    return watchedProducts?.reduce((total, item) => {
      return total + (parseFloat(item.requestedQuantity || 0) * parseFloat(item.unitPrice || 0))
    }, 0) || 0
  }

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        reference: data.reference,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone,
          address: data.customer.address
        },
        warehouse: data.warehouse,
        sourceLocation: data.sourceLocation,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
        products: data.products.map(item => ({
          product: item.product,
          requestedQuantity: parseFloat(item.requestedQuantity),
          unitPrice: parseFloat(item.unitPrice || 0),
          notes: item.notes || ''
        }))
      }

      if (isEditing) {
        await dispatch(updateDelivery({ id, data: formattedData })).unwrap()
        toast.success('Delivery updated successfully')
      } else {
        await dispatch(createDelivery(formattedData)).unwrap()
        toast.success('Delivery created successfully')
      }
      navigate('/operations/deliveries')
    } catch (error) {
      toast.error(error?.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Delivery' : 'New Delivery'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEditing ? 'Update delivery information' : 'Create a new delivery order'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer & Delivery Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">1</span>
              </span>
              Customer & Delivery Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  {...register('customer.name', { required: 'Customer name is required' })}
                />
                {errors.customer?.name && <p className="mt-1 text-sm text-red-500">{errors.customer.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Customer Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  {...register('customer.email')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  {...register('customer.phone')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Customer Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  {...register('customer.address')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  {...register('warehouse', { required: 'Warehouse is required' })}
                >
                  <option value="">Select warehouse</option>
                  {Array.isArray(warehouses) && warehouses.map((warehouse) => (
                    <option key={warehouse._id} value={warehouse._id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
                {errors.warehouse && <p className="mt-1 text-sm text-red-500">{errors.warehouse.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Source Location <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  {...register('sourceLocation', { required: 'Source location is required' })}
                >
                  <option value="">Select location</option>
                  {getLocations().map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.sourceLocation && <p className="mt-1 text-sm text-red-500">{errors.sourceLocation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Scheduled Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
                  placeholder="e.g., DEL-001"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  {...register('reference', { required: 'Reference is required' })}
                />
                {errors.reference && <p className="mt-1 text-sm text-red-500">{errors.reference.message}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Notes
              </label>
              <textarea
                rows="3"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                placeholder="Additional delivery notes..."
                {...register('notes')}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">2</span>
                </span>
                Products
              </h3>
              <button
                type="button"
                onClick={() => append({ product: '', requestedQuantity: 0, unitPrice: 0 })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium text-sm transition-all"
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

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Product SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., IPH15PM256"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
                        Requested Qty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        {...register(`products.${index}.requestedQuantity`, {
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Quantity must be at least 1' }
                        })}
                      />
                      {errors.products?.[index]?.requestedQuantity && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].requestedQuantity.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Unit Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        {...register(`products.${index}.unitPrice`, {
                          required: 'Unit price is required',
                          min: { value: 0, message: 'Price cannot be negative' }
                        })}
                      />
                      {errors.products?.[index]?.unitPrice && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].unitPrice.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Total
                      </label>
                      <div className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold">
                        ${((watchedProducts?.[index]?.requestedQuantity || 0) * (watchedProducts?.[index]?.unitPrice || 0)).toFixed(2)}
                      </div>
                    </div>
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

            <div className="mt-6 flex justify-end">
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Grand Total: </span>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              type="button"
              onClick={() => navigate('/operations/deliveries')}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30"
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
                isEditing ? 'Update Delivery' : 'Create Delivery'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeliveryForm