import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, setFilters } from '../../store/slices/productSlice'
import Card from '../common/Card'
import Button from '../common/Button'
import SearchInput from '../common/SearchInput'
import Select from '../common/Select'
import Badge from '../common/Badge'
import LoadingSpinner from '../common/LoadingSpinner'
import { PlusIcon, EyeIcon, PencilIcon, CubeIcon } from '@heroicons/react/24/outline'

const Products = () => {
  const dispatch = useDispatch()
  const { items: products, isLoading, pagination, filters } = useSelector(state => state.products)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    category: filters.category || '',
  })

  useEffect(() => {
    dispatch(fetchProducts({ 
      page: 1, 
      limit: 20,
      ...filters 
    }))
  }, [dispatch, filters])

  const handleSearch = (e) => {
    const search = e.target.value
    setLocalFilters(prev => ({ ...prev, search }))
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      dispatch(setFilters({ search }))
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }

  const getStockStatusBadge = (product) => {
    if (product.currentStock === 0) {
      return <Badge variant="danger">Out of Stock</Badge>
    } else if (product.currentStock <= product.reorderPoint) {
      return <Badge variant="warning">Low Stock</Badge>
    }
    return <Badge variant="success">In Stock</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your product inventory
          </p>
        </div>
        <Link to="/products/new">
          <Button icon={PlusIcon}>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              placeholder="Search products..."
              value={localFilters.search}
              onChange={handleSearch}
            />
            <Select
              placeholder="All Categories"
              value={localFilters.category}
              onChange={(e) => {
                const category = e.target.value
                setLocalFilters(prev => ({ ...prev, category }))
                dispatch(setFilters({ category }))
              }}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
            </Select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {pagination.totalItems || 0} products
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Card key={product._id}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </p>
                  </div>
                  {getStockStatusBadge(product)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Current Stock:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {product.currentStock || 0} {product.unitOfMeasure}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Unit Price:</span>
                    <span className="text-sm text-gray-900">
                      ${product.sellingPrice || 0}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link to={`/products/${product._id}`} className="flex-1">
                    <Button variant="outline" size="small" icon={EyeIcon} className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link to={`/products/${product._id}/edit`} className="flex-1">
                    <Button variant="primary" size="small" icon={PencilIcon} className="w-full">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new product.
                </p>
                <div className="mt-6">
                  <Link to="/products/new">
                    <Button icon={PlusIcon}>
                      Add Product
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products