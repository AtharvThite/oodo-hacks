import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createReceipt, updateReceipt, fetchReceipt } from '../../../store/slices/receiptSlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Select from '../../common/Select'
import LoadingSpinner from '../../common/LoadingSpinner'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const ReceiptForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentReceipt, isCreating, isUpdating } = useSelector(state => state.receipts)
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
      items: [{ product: '', expectedQuantity: 0, unitPrice: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchedItems = watch('items')

  useEffect(() => {
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchReceipt(id))
    }
  }, [dispatch, id, isEditing])

  useEffect(() => {
    if (isEditing && currentReceipt) {
      reset({
        supplier: currentReceipt.supplier,
        warehouse: currentReceipt.warehouse._id,
        expectedDate: currentReceipt.expectedDate?.split('T')[0],
        reference: currentReceipt.reference,
        notes: currentReceipt.notes,
        items: currentReceipt.items.map(item => ({
          product: item.product._id,
          expectedQuantity: item.expectedQuantity,
          unitPrice: item.unitPrice
        }))
      })
    }
  }, [currentReceipt, isEditing, reset])

  const calculateTotal = () => {
    return watchedItems?.reduce((total, item) => {
      return total + (parseFloat(item.expectedQuantity || 0) * parseFloat(item.unitPrice || 0))
    }, 0) || 0
  }

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        totalValue: calculateTotal(),
        items: data.items.map(item => ({
          ...item,
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
      navigate('/receipts')
    } catch (error) {
      toast.error(error || 'Something went wrong')
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
            <PlusIcon className="h-6 w-6 text-white" />
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
                  Expected Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('expectedDate', { required: 'Expected date is required' })}
                />
                {errors.expectedDate && <p className="mt-1 text-sm text-red-500">{errors.expectedDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  {...register('reference')}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                rows={3}
                {...register('notes')}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <span className="text-green-600 dark:text-green-400 text-sm font-bold">2</span>
                </span>
                Items
              </h3>
              <button
                type="button"
                onClick={() => append({ product: '', expectedQuantity: 0, unitPrice: 0 })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 font-medium transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="group p-5 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        {...register(`items.${index}.product`, { required: 'Product is required' })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Expected Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        {...register(`items.${index}.expectedQuantity`, {
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Quantity must be at least 1' }
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Unit Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        {...register(`items.${index}.unitPrice`, {
                          required: 'Unit price is required',
                          min: { value: 0, message: 'Price cannot be negative' }
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Total: <span className="text-green-600 dark:text-green-400">
                          ${((watchedItems?.[index]?.expectedQuantity || 0) * (watchedItems?.[index]?.unitPrice || 0)).toFixed(2)}
                        </span>
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
            onClick={() => navigate('/receipts')}
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