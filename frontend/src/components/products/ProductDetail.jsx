import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../../store/slices/productSlice'
import Card from '../common/Card'
import Button from '../common/Button'
import Badge from '../common/Badge'
import LoadingSpinner from '../common/LoadingSpinner'
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProduct: product, isLoading } = useSelector(state => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Product not found</h3>
        <p className="mt-1 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  const getStockStatusBadge = () => {
    if (product.currentStock === 0) {
      return <Badge variant="danger">Out of Stock</Badge>
    } else if (product.currentStock <= product.reorderPoint) {
      return <Badge variant="warning">Low Stock</Badge>
    }
    return <Badge variant="success">In Stock</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={ArrowLeftIcon}
            onClick={() => navigate('/products')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              SKU: {product.sku}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStockStatusBadge()}
          <Link to={`/products/${id}/edit`}>
            <Button icon={PencilIcon}>
              Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Product Information
              </h3>
              
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">SKU</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.sku}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Unit of Measure</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{product.unitOfMeasure}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cost Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">${product.costPrice || 0}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Selling Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">${product.sellingPrice || 0}</dd>
                </div>
              </dl>
              
              {product.description && (
                <div className="mt-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-2 text-sm text-gray-900">{product.description}</dd>
                </div>
              )}
            </div>
          </Card>

          {/* Stock History */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Recent Stock Movements
              </h3>
              
              {product.stockHistory && product.stockHistory.length > 0 ? (
                <div className="space-y-3">
                  {product.stockHistory.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {movement.reference}
                        </p>
                        <p className="text-sm text-gray-500">
                          {movement.location?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(movement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No stock movements yet
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Stock Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Stock Information
              </h3>
              
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">
                    {product.currentStock || 0}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      {product.unitOfMeasure}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reorder Point</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">
                    {product.reorderPoint}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Min Stock Level</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">
                    {product.minStockLevel || 0}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Stock Level</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">
                    {product.maxStockLevel || 0}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail