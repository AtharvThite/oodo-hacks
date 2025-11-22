import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createWarehouse, updateWarehouse, fetchWarehouse } from '../../store/slices/warehouseSlice'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'

const WarehouseForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentWarehouse, isCreating, isUpdating } = useSelector(state => state.warehouses)
  
  const isEditing = Boolean(id)
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchWarehouse(id))
    }
  }, [dispatch, id, isEditing])

  useEffect(() => {
    if (isEditing && currentWarehouse) {
      reset({
        name: currentWarehouse.name,
        code: currentWarehouse.code,
        address: currentWarehouse.address,
        manager: currentWarehouse.manager,
        phone: currentWarehouse.phone,
        email: currentWarehouse.email,
        isActive: currentWarehouse.isActive
      })
    }
  }, [currentWarehouse, isEditing, reset])

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await dispatch(updateWarehouse({ id, data })).unwrap()
        toast.success('Warehouse updated successfully')
      } else {
        await dispatch(createWarehouse(data)).unwrap()
        toast.success('Warehouse created successfully')
      }
      navigate('/settings/warehouses')
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Warehouse' : 'Add New Warehouse'}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {isEditing ? 'Update warehouse information' : 'Create a new warehouse location'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Warehouse Name"
              required
              error={errors.name?.message}
              {...register('name', {
                required: 'Warehouse name is required'
              })}
            />

            <Input
              label="Warehouse Code"
              required
              error={errors.code?.message}
              {...register('code', {
                required: 'Warehouse code is required',
                pattern: {
                  value: /^[A-Z0-9-_]+$/,
                  message: 'Code can only contain uppercase letters, numbers, hyphens, and underscores'
                }
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
              {...register('address')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Manager Name"
              error={errors.manager?.message}
              {...register('manager')}
            />

            <Input
              label="Phone"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('isActive')}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Warehouse
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/settings/warehouses')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isEditing ? 'Update Warehouse' : 'Create Warehouse'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default WarehouseForm