import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createProduct, updateProduct, fetchProduct } from '../../store/slices/productSlice'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import LoadingSpinner from '../common/LoadingSpinner'

const ProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, isCreating, isUpdating } = useSelector(state => state.products)
  
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
      dispatch(fetchProduct(id))
    }
  }, [dispatch, id, isEditing])

  useEffect(() => {
    if (isEditing && currentProduct) {
      reset({
        name: currentProduct.name,
        sku: currentProduct.sku,
        description: currentProduct.description,
        category: currentProduct.category,
        unitOfMeasure: currentProduct.unitOfMeasure,
        costPrice: currentProduct.costPrice,
        sellingPrice: currentProduct.sellingPrice,
        minStockLevel: currentProduct.minStockLevel,
        maxStockLevel: currentProduct.maxStockLevel,
        reorderPoint: currentProduct.reorderPoint,
      })
    }
  }, [currentProduct, isEditing, reset])

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await dispatch(updateProduct({ id, data })).unwrap()
        toast.success('Product updated successfully')
      } else {
        await dispatch(createProduct(data)).unwrap()
        toast.success('Product created successfully')
      }
      navigate('/products')
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {isEditing ? 'Update product information' : 'Create a new product in your inventory'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              required
              error={errors.name?.message}
              {...register('name', {
                required: 'Product name is required',
                maxLength: {
                  value: 200,
                  message: 'Name cannot exceed 200 characters'
                }
              })}
            />

            <Input
              label="SKU"
              required
              error={errors.sku?.message}
              {...register('sku', {
                required: 'SKU is required',
                pattern: {
                  value: /^[A-Z0-9-_]+$/,
                  message: 'SKU can only contain uppercase letters, numbers, hyphens, and underscores'
                }
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Category"
              required
              error={errors.category?.message}
              {...register('category', {
                required: 'Category is required'
              })}
            />

            <Select
              label="Unit of Measure"
              required
              error={errors.unitOfMeasure?.message}
              {...register('unitOfMeasure', {
                required: 'Unit of measure is required'
              })}
            >
              <option value="">Select unit</option>
              <option value="pieces">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="liters">Liters</option>
              <option value="meters">Meters</option>
              <option value="boxes">Boxes</option>
              <option value="tons">Tons</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Cost Price"
              type="number"
              step="0.01"
              min="0"
              error={errors.costPrice?.message}
              {...register('costPrice', {
                min: {
                  value: 0,
                  message: 'Cost price cannot be negative'
                }
              })}
            />

            <Input
              label="Selling Price"
              type="number"
              step="0.01"
              min="0"
              error={errors.sellingPrice?.message}
              {...register('sellingPrice', {
                min: {
                  value: 0,
                  message: 'Selling price cannot be negative'
                }
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Minimum Stock Level"
              type="number"
              min="0"
              error={errors.minStockLevel?.message}
              {...register('minStockLevel', {
                min: {
                  value: 0,
                  message: 'Minimum stock level cannot be negative'
                }
              })}
            />

            <Input
              label="Maximum Stock Level"
              type="number"
              min="1"
              error={errors.maxStockLevel?.message}
              {...register('maxStockLevel', {
                min: {
                  value: 1,
                  message: 'Maximum stock level must be positive'
                }
              })}
            />

            <Input
              label="Reorder Point"
              type="number"
              min="0"
              error={errors.reorderPoint?.message}
              {...register('reorderPoint', {
                min: {
                  value: 0,
                  message: 'Reorder point cannot be negative'
                }
              })}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProductForm