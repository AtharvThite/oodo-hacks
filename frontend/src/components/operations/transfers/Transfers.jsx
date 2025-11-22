import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransfers, setFilters } from '../../../store/slices/transferSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import SearchInput from '../../common/SearchInput'
import Select from '../../common/Select'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline'

const Transfers = () => {
  const dispatch = useDispatch()
  const { items: transfers, isLoading, pagination, filters } = useSelector(state => state.transfers)
  
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    status: filters.status || '',
  })

  useEffect(() => {
    dispatch(fetchTransfers({ 
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { variant: 'secondary', text: 'Draft' },
      confirmed: { variant: 'primary', text: 'Confirmed' },
      in_transit: { variant: 'warning', text: 'In Transit' },
      received: { variant: 'success', text: 'Received' },
      cancelled: { variant: 'danger', text: 'Cancelled' }
    }
    
    const config = statusConfig[status] || statusConfig.draft
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
          <h1 className="text-2xl font-semibold text-gray-900">Transfers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage stock transfers between warehouses
          </p>
        </div>
        <Link to="/transfers/new">
          <Button icon={PlusIcon}>
            New Transfer
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              placeholder="Search transfers..."
              value={localFilters.search}
              onChange={handleSearch}
            />
            <Select
              placeholder="All Status"
              value={localFilters.status}
              onChange={(e) => {
                const status = e.target.value
                setLocalFilters(prev => ({ ...prev, status }))
                dispatch(setFilters({ status }))
              }}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {pagination.totalItems || 0} transfers
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Transfers List */}
      <Card>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items Count
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transfers && transfers.length > 0 ? (
                transfers.map((transfer) => (
                  <tr key={transfer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transfer.transferNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.fromWarehouse?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transfer.toWarehouse?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transfer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transfer.transferDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transfer.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/transfers/${transfer._id}`}
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
                        No transfers found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new transfer.
                      </p>
                      <div className="mt-6">
                        <Link to="/transfers/new">
                          <Button icon={PlusIcon}>
                            New Transfer
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

export default Transfers