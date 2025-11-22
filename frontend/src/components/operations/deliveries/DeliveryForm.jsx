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
    setValue,
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
      navigate('/dashboard')
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
                error={errors.customer?.name?.message}
                {...register('customer.name', {
                  required: 'Customer name is required'
                })}
              />

              <Input
                label="Customer Email"
                type="email"
                error={errors.customer?.email?.message}
                {...register('customer.email')}
              />

              <Input
                label="Customer Phone"
                error={errors.customer?.phone?.message}
                {...register('customer.phone')}
              />

              <Input
                label="Customer Address"
                error={errors.customer?.address?.message}
                {...register('customer.address')}
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
                {getLocations().map((location) => (
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
                onClick={() => append({ product: '', requestedQuantity: 0, unitPrice: 0 })}
              >
                Add Product
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border border-gray-200 rounded-lg">
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
                    label="Requested Quantity"
                    type="number"
                    min="1"
                    required
                    error={errors.products?.[index]?.requestedQuantity?.message}
                    {...register(`products.${index}.requestedQuantity`, {
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' }
                    })}
                  />

                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    error={errors.products?.[index]?.unitPrice?.message}
                    {...register(`products.${index}.unitPrice`, {
                      required: 'Unit price is required',
                      min: { value: 0, message: 'Price cannot be negative' }
                    })}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Total: ${((watchedProducts?.[index]?.requestedQuantity || 0) * (watchedProducts?.[index]?.unitPrice || 0)).toFixed(2)}
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