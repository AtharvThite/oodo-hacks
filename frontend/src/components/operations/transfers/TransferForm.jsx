import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createTransfer, updateTransfer, fetchTransfer } from '../../../store/slices/transferSlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Select from '../../common/Select'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

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
      sourceLocation: '',
      destinationLocation: '',
      scheduledDate: '',
      reference: '',
      transferType: 'internal',
      notes: '',
      products: [{ product: '', quantity: 0 }]
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
      { id: `${watchedSourceWarehouse}_packing`, name: 'Packing' }
    ]
  }

  const getDestLocations = () => {
    if (!watchedDestWarehouse) return []
    return [
      { id: `${watchedDestWarehouse}_storage`, name: 'Storage' },
      { id: `${watchedDestWarehouse}_receiving`, name: 'Receiving' },
      { id: `${watchedDestWarehouse}_quality`, name: 'Quality Check' }
    ]
  }

  useEffect(() => {
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchTransfer(id))
    }
  }, [dispatch, id, isEditing])

  const onSubmit = async (data) => {
    try {
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
      navigate('/dashboard')
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Transfer' : 'New Transfer'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Transfer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Source Warehouse (for location)"
                {...register('sourceWarehouse')}
              >
                <option value="">Select warehouse</option>
                {Array.isArray(warehouses) && warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Source Location"
                required
                error={errors.sourceLocation?.message}
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
              </Select>

              <Select
                label="Destination Warehouse (for location)"
                {...register('destinationWarehouse')}
              >
                <option value="">Select warehouse</option>
                {Array.isArray(warehouses) && warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Destination Location"
                required
                error={errors.destinationLocation?.message}
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
              </Select>

              <Input
                label="Scheduled Date"
                type="date"
                required
                error={errors.scheduledDate?.message}
                {...register('scheduledDate', {
                  required: 'Scheduled date is required'
                })}
              />

              <Input
                label="Reference"
                required
                error={errors.reference?.message}
                {...register('reference', {
                  required: 'Reference is required'
                })}
              />

              <Select
                label="Transfer Type"
                {...register('transferType')}
              >
                <option value="internal">Internal</option>
                <option value="inter-warehouse">Inter-warehouse</option>
              </Select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register('notes')}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Products
              </h3>
              <Button
                type="button"
                variant="outline"
                icon={PlusIcon}
                onClick={() => append({ product: '', quantity: 0 })}
              >
                Add Product
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border border-gray-200 rounded-lg">
                  <Input
                    label="Product SKU"
                    required
                    placeholder="e.g., IPH15PM256"
                    error={errors.products?.[index]?.product?.message}
                    {...register(`products.${index}.product`, {
                      required: 'Product is required'
                    })}
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    required
                    error={errors.products?.[index]?.quantity?.message}
                    {...register(`products.${index}.quantity`, {
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' }
                    })}
                  />

                  <div className="flex items-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        icon={TrashIcon}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/operations/transfers')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Update Transfer' : 'Create Transfer'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default TransferForm