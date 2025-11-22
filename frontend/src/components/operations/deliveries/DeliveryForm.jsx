import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createDelivery, updateDelivery, fetchDelivery } from '../../../store/slices/deliverySlice'
import { fetchWarehouses } from '../../../store/slices/warehouseSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Input from '../../common/Input'
import Select from '../../common/Select'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

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
      items: [{ product: '', quantity: 0, unitPrice: 0 }]
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
      dispatch(fetchDelivery(id))
    }
  }, [dispatch, id, isEditing])

  const calculateTotal = () => {
    return watchedItems?.reduce((total, item) => {
      return total + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0))
    }, 0) || 0
  }

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        totalValue: calculateTotal(),
        items: data.items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice)
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
      toast.error(error || 'Something went wrong')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Delivery' : 'New Delivery'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Delivery Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Customer Name"
                required
                error={errors.customer?.message}
                {...register('customer', {
                  required: 'Customer name is required'
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
                error={errors.reference?.message}
                {...register('reference')}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Items
              </h3>
              <Button
                type="button"
                variant="outline"
                icon={PlusIcon}
                onClick={() => append({ product: '', quantity: 0, unitPrice: 0 })}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border border-gray-200 rounded-lg">
                  <Input
                    label="Product Name"
                    required
                    {...register(`items.${index}.product`, {
                      required: 'Product is required'
                    })}
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    required
                    {...register(`items.${index}.quantity`, {
                      required: 'Quantity is required'
                    })}
                  />

                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    {...register(`items.${index}.unitPrice`, {
                      required: 'Unit price is required'
                    })}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Total: ${((watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.unitPrice || 0)).toFixed(2)}
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        icon={TrashIcon}
                        onClick={() => remove(index)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="text-lg font-semibold text-gray-900">
                Grand Total: ${calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/operations/deliveries')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Update Delivery' : 'Create Delivery'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DeliveryForm