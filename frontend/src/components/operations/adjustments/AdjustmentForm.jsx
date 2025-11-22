import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createAdjustment, updateAdjustment, fetchAdjustment } from '../../../store/slices/adjustmentSlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Select from '../../common/Select'

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
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchAdjustment(id))
    }
  }, [dispatch, id, isEditing])

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        quantityChange: parseFloat(data.quantityChange)
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
      toast.error(error || 'Something went wrong')
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
              label="Product Name"
              required
              error={errors.product?.message}
              {...register('product', {
                required: 'Product is required'
              })}
            />

            <Select
              label="Warehouse"
              required
              error={errors.warehouse?.message}
              {...register('warehouse', {
                required: 'Warehouse is required'
              })}
            >
              <option value="">Select warehouse</option>
              {warehouses?.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </option>
              ))}
            </Select>

            <Select
              label="Adjustment Type"
              required
              error={errors.adjustmentType?.message}
              {...register('adjustmentType', {
                required: 'Adjustment type is required'
              })}
            >
              <option value="">Select type</option>
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
              <option value="correction">Correction</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
            </Select>

            <Input
              label="Quantity Change"
              type="number"
              required
              error={errors.quantityChange?.message}
              {...register('quantityChange', {
                required: 'Quantity change is required'
              })}
            />

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
              label="Reference"
              error={errors.reference?.message}
              {...register('reference')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
              {...register('reason')}
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