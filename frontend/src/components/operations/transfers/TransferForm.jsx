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
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      items: [{ product: '', quantity: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  useEffect(() => {
    dispatch(fetchWarehouses())
    
    if (isEditing && id) {
      dispatch(fetchTransfer(id))
    }
  }, [dispatch, id, isEditing])

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity)
        }))
      }

      if (isEditing) {
        await dispatch(updateTransfer({ id, data: formattedData })).unwrap()
        toast.success('Transfer updated successfully')
      } else {
        await dispatch(createTransfer(formattedData)).unwrap()
        toast.success('Transfer created successfully')
      }
      navigate('/operations/transfers')
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
                label="From Warehouse"
                required
                error={errors.fromWarehouse?.message}
                {...register('fromWarehouse', {
                  required: 'From warehouse is required'
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
                label="To Warehouse"
                required
                error={errors.toWarehouse?.message}
                {...register('toWarehouse', {
                  required: 'To warehouse is required'
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
                label="Transfer Date"
                type="date"
                required
                error={errors.transferDate?.message}
                {...register('transferDate', {
                  required: 'Transfer date is required'
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
                onClick={() => append({ product: '', quantity: 0 })}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border border-gray-200 rounded-lg">
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