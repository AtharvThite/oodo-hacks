import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createReceipt, updateReceipt, fetchReceipt } from '../../../store/slices/receiptSlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import { Plus, Trash2, Package, PackagePlus } from 'lucide-react'

const ReceiptForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentReceipt, isCreating, isUpdating } = useSelector(state => state.receipts)
  const { items: warehouses } = useSelector(state => state.warehouses)
  const [locations, setLocations] = useState([])
  
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
      reference: '',
      supplier: '',
      supplierEmail: '',
      supplierPhone: '',
      supplierAddress: '',
      warehouse: '',
      location: '',
      scheduledDate: '',
      notes: '',
      products: [{ product: '', expectedQuantity: 0, unitPrice: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  })

  const watchedProducts = watch('products')
  const watchedWarehouse = watch('warehouse')

  // Fetch warehouses on mount
  useEffect(() => {
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchReceipt(id))
    }
  }, [dispatch, id, isEditing])

  // Fetch locations when warehouse changes
  useEffect(() => {
    if (watchedWarehouse) {
      const selectedWh = warehouses?.find(w => w._id === watchedWarehouse)
      if (selectedWh) {
        // Mock locations; in production, fetch from backend
        setLocations([
          { _id: watchedWarehouse + '_storage', name: 'Storage' },
          { _id: watchedWarehouse + '_receiving', name: 'Receiving' },
          { _id: watchedWarehouse + '_quality', name: 'Quality Check' }
        ])
      }
    } else {
      setLocations([])
    }
  }, [watchedWarehouse, warehouses])

  useEffect(() => {
    if (isEditing && currentReceipt) {
      reset({
        reference: currentReceipt.reference || '',
        supplier: currentReceipt.supplier?.name || '',
        supplierEmail: currentReceipt.supplier?.email || '',
        supplierPhone: currentReceipt.supplier?.phone || '',
        supplierAddress: currentReceipt.supplier?.address || '',
        warehouse: currentReceipt.warehouse?._id || currentReceipt.warehouse || '',
        location: currentReceipt.location?._id || currentReceipt.location || '',
        scheduledDate: currentReceipt.scheduledDate?.split('T')[0] || '',
        notes: currentReceipt.notes || '',
        products: currentReceipt.products?.map(item => ({
          product: item.product?._id || item.product,
          expectedQuantity: item.expectedQuantity,
          unitPrice: item.unitPrice
        })) || [{ product: '', expectedQuantity: 0, unitPrice: 0 }]
      })
    }
  }, [currentReceipt, isEditing, reset])

  const calculateTotal = () => {
    return watchedProducts?.reduce((total, item) => {
      return total + (parseFloat(item.expectedQuantity || 0) * parseFloat(item.unitPrice || 0))
    }, 0) || 0
  }

  const onSubmit = async (data) => {
    try {
      // Validate at least one product exists
      if (!data.products || data.products.length === 0 || data.products.every(p => !p.product)) {
        toast.error('At least one product is required')
        return
      }

      const formattedData = {
        reference: data.reference,
        supplier: {
          name: data.supplier,
          email: data.supplierEmail || '',
          phone: data.supplierPhone || '',
          address: data.supplierAddress || ''
        },
        warehouse: data.warehouse,
        location: data.location,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
        products: data.products.map(item => ({
          product: item.product,
          expectedQuantity: parseFloat(item.expectedQuantity),
          unitPrice: parseFloat(item.unitPrice)
        }))
      }

      if (isEditing) {
        await dispatch(updateReceipt({ id, data: formattedData })).unwrap()
        toast.success('Receipt updated successfully')
      } else {
        await dispatch(createReceipt(formattedData)).unwrap()
        toast.success('Receipt created successfully')
      }
      navigate('/operations/receipts')
    } catch (error) {
      toast.error(error?.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
            <PackagePlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Receipt' : 'New Receipt'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEditing ? 'Update receipt information' : 'Create a new stock receipt'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                <span className="text-green-600 dark:text-green-400 text-sm font-bold">1</span>
              </span>
              Receipt Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Reference <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., REC-001"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('reference', { required: 'Reference is required' })}
                />
                {errors.reference && <p className="mt-1 text-sm text-red-500">{errors.reference.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('supplier', { required: 'Supplier name is required' })}
                />
                {errors.supplier && <p className="mt-1 text-sm text-red-500">{errors.supplier.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Supplier Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('supplierEmail')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Supplier Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('supplierPhone')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('location', { required: 'Location is required' })}
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Scheduled Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('scheduledDate', { required: 'Scheduled date is required' })}
                />
                {errors.scheduledDate && <p className="mt-1 text-sm text-red-500">{errors.scheduledDate.message}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Supplier Address
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                rows={2}
                {...register('supplierAddress')}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                rows={3}
                placeholder="Add any additional notes..."
                {...register('notes')}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">2</span>
                </span>
                Products
              </h3>
              <button
                type="button"
                onClick={() => append({ product: '', expectedQuantity: 0, unitPrice: 0 })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 font-medium text-sm transition-all"
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
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                        Expected Qty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        {...register(`products.${index}.expectedQuantity`, {
                          required: 'Quantity is required',
                          min: { value: 0.01, message: 'Quantity must be greater than 0' }
                        })}
                      />
                      {errors.products?.[index]?.expectedQuantity && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].expectedQuantity.message}</p>
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
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                        ${((watchedProducts?.[index]?.expectedQuantity || 0) * (watchedProducts?.[index]?.unitPrice || 0)).toFixed(2)}
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
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Grand Total: </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              type="button"
              onClick={() => navigate('/operations/receipts')}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/30"
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
                isEditing ? 'Update Receipt' : 'Create Receipt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReceiptForm