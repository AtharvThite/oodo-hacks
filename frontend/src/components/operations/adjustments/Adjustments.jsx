import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdjustments, setFilters } from '../../../store/slices/adjustmentSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import SearchInput from '../../common/SearchInput'
import Select from '../../common/Select'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline'

const Adjustments = () => {
  const dispatch = useDispatch()
  const { items: adjustments, isLoading, pagination, filters } = useSelector(state => state.adjustments)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    type: filters.type || '',
  })

  useEffect(() => {
    dispatch(fetchAdjustments({ 
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

  const getTypeBadge = (type) => {
    const typeConfig = {
      increase: { variant: 'success', text: 'Increase' },
      decrease: { variant: 'danger', text: 'Decrease' },
      correction: { variant: 'warning', text: 'Correction' },
      damaged: { variant: 'danger', text: 'Damaged' },
      lost: { variant: 'danger', text: 'Lost' }
    }
    
    const config = typeConfig[type] || typeConfig.correction
    return <Badge variant={config.variant}>{config.text}</Badge>
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
          <h1 className="text-2xl font-semibold text-gray-900">Stock Adjustments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage stock level adjustments and corrections
          </p>
        </div>
        <Link to="/adjustments/new">
          <Button icon={PlusIcon}>
            New Adjustment
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              placeholder="Search adjustments..."
              value={localFilters.search}
              onChange={handleSearch}
            />
            <Select
              placeholder="All Types"
              value={localFilters.type}
              onChange={(e) => {
                const type = e.target.value
                setLocalFilters(prev => ({ ...prev, type }))
                dispatch(setFilters({ type }))
              }}
            >
              <option value="">All Types</option>
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
              <option value="correction">Correction</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
            </Select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {pagination.totalItems || 0} adjustments
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Adjustments List */}
      <Card>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adjustments && adjustments.length > 0 ? (
                adjustments.map((adjustment) => (
                  <tr key={adjustment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {adjustment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adjustment.product?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adjustment.warehouse?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(adjustment.adjustmentType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${
                        ['increase', 'correction'].includes(adjustment.adjustmentType) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {['increase', 'correction'].includes(adjustment.adjustmentType) ? '+' : '-'}
                        {Math.abs(adjustment.quantityChange)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(adjustment.adjustmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/adjustments/${adjustment._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-center">
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No adjustments found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new adjustment.
                      </p>
                      <div className="mt-6">
                        <Link to="/adjustments/new">
                          <Button icon={PlusIcon}>
                            New Adjustment
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Adjustments