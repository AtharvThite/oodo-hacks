import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createAdjustment, updateAdjustment, fetchAdjustment } from '../../../store/slices/adjustmentSlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Select from '../../common/Select'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const AdjustmentForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentAdjustment, isCreating, isUpdating } = useSelector(state => state.adjustments)
  const { items: warehouses } = useSelector(state => state.warehouses)
  
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
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchAdjustment(id))
    }
  }, [dispatch, id, isEditing])

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
      navigate('/dashboard')
    } catch (error) {
      toast.error(error?.message || 'Something went wrong')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Adjustment' : 'New Stock Adjustment'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Location"
              placeholder="e.g., Storage (MDC), Receiving (RWN)"
              required
              error={errors.location?.message}
              {...register('location', {
                required: 'Location is required'
              })}
            />

            <Select
              label="Adjustment Type"
              required
              error={errors.adjustmentType?.message}
              {...register('adjustmentType', {
                required: 'Adjustment type is required'
              })}
            >
              <option value="">Select type</option>
              <option value="physical_count">Physical Count</option>
              <option value="damage">Damage</option>
              <option value="loss">Loss</option>
              <option value="found">Found</option>
              <option value="correction">Correction</option>
            </Select>

            <Input
              label="Adjustment Date"
              type="date"
              required
              error={errors.adjustmentDate?.message}
              {...register('adjustmentDate', {
                required: 'Adjustment date is required'
              })}
            />

            <Input
              label="Reference (Optional)"
              placeholder="Auto-generated if empty"
              error={errors.reference?.message}
              {...register('reference')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment Reason *
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={2}
              placeholder="Explain why this adjustment is needed"
              {...register('reason', {
                required: 'Adjustment reason is required'
              })}
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          {/* Products Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Products</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={PlusIcon}
                onClick={() => append({ product: '', theoreticalQuantity: 0, actualQuantity: 0, reason: '' })}
              >
                Add Product
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="Product SKU"
                    placeholder="e.g., IPH15PM256"
                    required
                    error={errors.products?.[index]?.product?.message}
                    {...register(`products.${index}.product`, {
                      required: 'Product SKU is required'
                    })}
                  />
                  
                  <Input
                    label="Theoretical Quantity"
                    type="number"
                    step="0.01"
                    required
                    error={errors.products?.[index]?.theoreticalQuantity?.message}
                    {...register(`products.${index}.theoreticalQuantity`, {
                      required: 'Theoretical quantity is required',
                      min: { value: 0, message: 'Must be non-negative' }
                    })}
                  />
                  
                  <Input
                    label="Actual Quantity"
                    type="number"
                    step="0.01"
                    required
                    error={errors.products?.[index]?.actualQuantity?.message}
                    {...register(`products.${index}.actualQuantity`, {
                      required: 'Actual quantity is required',
                      min: { value: 0, message: 'Must be non-negative' }
                    })}
                  />

                  <div className="flex items-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={TrashIcon}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  <Input
                    label="Product-specific Reason (Optional)"
                    placeholder="Additional notes for this product"
                    {...register(`products.${index}.reason`)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={2}
              placeholder="Optional additional notes"
              {...register('notes')}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/operations/adjustments')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isEditing ? 'Update Adjustment' : 'Create Adjustment'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AdjustmentForm