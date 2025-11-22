import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWarehouses, setFilters } from '../../store/slices/warehouseSlice'
import Card from '../common/Card'
import Button from '../common/Button'
import SearchInput from '../common/SearchInput'
import Badge from '../common/Badge'
import LoadingSpinner from '../common/LoadingSpinner'
import { PlusIcon, EyeIcon, PencilIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

const Warehouses = () => {
  const dispatch = useDispatch()
  const { items: warehouses, isLoading, pagination, filters } = useSelector(state => state.warehouses)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
  })

  useEffect(() => {
    dispatch(fetchWarehouses({ 
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
          <h1 className="text-2xl font-semibold text-gray-900">Warehouses</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your warehouse locations and storage facilities
          </p>
        </div>
        <Link to="/warehouses/new">
          <Button icon={PlusIcon}>
            Add Warehouse
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchInput
              placeholder="Search warehouses..."
              value={localFilters.search}
              onChange={handleSearch}
            />
            <div className="flex items-center justify-end space-x-2">
              <span className="text-sm text-gray-700">
                {pagination.totalItems || 0} warehouses
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses && warehouses.length > 0 ? (
          warehouses.map((warehouse) => (
            <Card key={warehouse._id}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-8 w-8 text-primary-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {warehouse.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {warehouse.code}
                      </p>
                    </div>
                  </div>
                  <Badge variant={warehouse.isActive ? 'success' : 'secondary'}>
                    {warehouse.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Address:</span>
                    <span className="text-sm text-gray-900 text-right max-w-40">
                      {warehouse.address || 'No address'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Locations:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {warehouse.locations?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Manager:</span>
                    <span className="text-sm text-gray-900">
                      {warehouse.manager || 'Unassigned'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link to={`/warehouses/${warehouse._id}`} className="flex-1">
                    <Button variant="outline" size="small" icon={EyeIcon} className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link to={`/warehouses/${warehouse._id}/edit`} className="flex-1">
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
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No warehouses found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new warehouse.
                </p>
                <div className="mt-6">
                  <Link to="/warehouses/new">
                    <Button icon={PlusIcon}>
                      Add Warehouse
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

export default Warehouses