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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Receipt' : 'New Receipt'}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {isEditing ? 'Update receipt information' : 'Create a new stock receipt'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Receipt Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Supplier Name"
                required
                error={errors.supplier?.message}
                {...register('supplier', {
                  required: 'Supplier name is required'
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
                label="Expected Date"
                type="date"
                required
                error={errors.expectedDate?.message}
                {...register('expectedDate', {
                  required: 'Expected date is required'
                })}
              />

              <Input
                label="Reference"
                error={errors.reference?.message}
                {...register('reference')}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                rows={3}
                {...register('notes')}
              />
            </div>
          </div>
        </Card>

        {/* Items */}
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
                onClick={() => append({ product: '', expectedQuantity: 0, unitPrice: 0 })}
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
                    error={errors.items?.[index]?.product?.message}
                    {...register(`items.${index}.product`, {
                      required: 'Product is required'
                    })}
                  />

                  <Input
                    label="Expected Quantity"
                    type="number"
                    min="1"
                    required
                    error={errors.items?.[index]?.expectedQuantity?.message}
                    {...register(`items.${index}.expectedQuantity`, {
                      required: 'Quantity is required',
                      min: {
                        value: 1,
                        message: 'Quantity must be at least 1'
                      }
                    })}
                  />

                  <Input
                    label="Unit Price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    error={errors.items?.[index]?.unitPrice?.message}
                    {...register(`items.${index}.unitPrice`, {
                      required: 'Unit price is required',
                      min: {
                        value: 0,
                        message: 'Price cannot be negative'
                      }
                    })}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Total: ${((watchedItems?.[index]?.expectedQuantity || 0) * (watchedItems?.[index]?.unitPrice || 0)).toFixed(2)}
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

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/receipts')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Update Receipt' : 'Create Receipt'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReceiptForm