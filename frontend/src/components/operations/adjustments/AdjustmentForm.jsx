import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createAdjustment, updateAdjustment, fetchAdjustment } from '../../../store/slices/adjustmentSlice'
import { Sliders, Plus, Trash2, Package } from 'lucide-react'

const AdjustmentForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentAdjustment, isCreating, isUpdating } = useSelector(state => state.adjustments)
  
  const isEditing = Boolean(id)
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      products: [{ product: '', theoreticalQuantity: 0, actualQuantity: 0, reason: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  })

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchAdjustment(id))
    }
  }, [dispatch, id, isEditing])

  useEffect(() => {
    if (isEditing && currentAdjustment) {
      reset({
        location: currentAdjustment.location,
        adjustmentType: currentAdjustment.adjustmentType,
        adjustmentDate: currentAdjustment.adjustmentDate?.split('T')[0],
        reason: currentAdjustment.reason,
        notes: currentAdjustment.notes,
        products: currentAdjustment.products || [{ product: '', theoreticalQuantity: 0, actualQuantity: 0, reason: '' }]
      })
    }
  }, [currentAdjustment, isEditing, reset])

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        location: data.location,
        adjustmentType: data.adjustmentType,
        adjustmentDate: data.adjustmentDate,
        reason: data.reason,
        notes: data.notes,
        products: data.products.map(p => ({
          product: p.product,
          theoreticalQuantity: parseFloat(p.theoreticalQuantity),
          actualQuantity: parseFloat(p.actualQuantity),
          reason: p.reason || data.reason
        }))
      }

      if (isEditing) {
        await dispatch(updateAdjustment({ id, data: formattedData })).unwrap()
        toast.success('Adjustment updated successfully')
      } else {
        await dispatch(createAdjustment(formattedData)).unwrap()
        toast.success('Adjustment created successfully')
      }
      navigate('/operations/adjustments')
    } catch (error) {
      toast.error(error?.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 dark:bg-yellow-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg shadow-orange-500/30">
            <Sliders className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Adjustment' : 'New Stock Adjustment'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEditing ? 'Update adjustment information' : 'Create a new stock adjustment'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Details Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">1</span>
              </span>
              Adjustment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Storage (MDC), Receiving (RWN)"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Adjustment Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  {...register('adjustmentType', { required: 'Adjustment type is required' })}
                >
                  <option value="">Select type</option>
                  <option value="physical_count">Physical Count</option>
                  <option value="damage">Damage</option>
                  <option value="loss">Loss</option>
                  <option value="found">Found</option>
                  <option value="correction">Correction</option>
                </select>
                {errors.adjustmentType && <p className="mt-1 text-sm text-red-500">{errors.adjustmentType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Adjustment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  {...register('adjustmentDate', { required: 'Adjustment date is required' })}
                />
                {errors.adjustmentDate && <p className="mt-1 text-sm text-red-500">{errors.adjustmentDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  {...register('reference')}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Adjustment Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                rows={2}
                placeholder="Explain why this adjustment is needed"
                {...register('reason', { required: 'Adjustment reason is required' })}
              />
              {errors.reason && <p className="mt-1 text-sm text-red-500">{errors.reason.message}</p>}
            </div>
          </div>

          {/* Products Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                  <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">2</span>
                </span>
                Products
              </h3>
              <button
                type="button"
                onClick={() => append({ product: '', theoreticalQuantity: 0, actualQuantity: 0, reason: '' })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-medium text-sm transition-all"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Product SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., IPH15PM256"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        {...register(`products.${index}.product`, {
                          required: 'Product SKU is required'
                        })}
                      />
                      {errors.products?.[index]?.product && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].product.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Theoretical Qty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        {...register(`products.${index}.theoreticalQuantity`, {
                          required: 'Theoretical quantity is required',
                          min: { value: 0, message: 'Must be non-negative' }
                        })}
                      />
                      {errors.products?.[index]?.theoreticalQuantity && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].theoreticalQuantity.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Actual Qty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        {...register(`products.${index}.actualQuantity`, {
                          required: 'Actual quantity is required',
                          min: { value: 0, message: 'Must be non-negative' }
                        })}
                      />
                      {errors.products?.[index]?.actualQuantity && (
                        <p className="mt-1 text-sm text-red-500">{errors.products[index].actualQuantity.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Product-specific Reason (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Additional notes for this product"
                      className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      {...register(`products.${index}.reason`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">3</span>
              </span>
              Additional Notes
            </h3>
            <textarea
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              rows={3}
              placeholder="Optional additional notes"
              {...register('notes')}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button
              type="button"
              onClick={() => navigate('/operations/adjustments')}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/30"
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
                isEditing ? 'Update Adjustment' : 'Create Adjustment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdjustmentForm