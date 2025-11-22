import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dashboardService from '../../store/services/dashboardService'
import Card from '../common/Card'
import SearchInput from '../common/SearchInput'
import Select from '../common/Select'
import Badge from '../common/Badge'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const MoveHistory = () => {
  const [moves, setMoves] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, total: 1, totalItems: 0 })
  const [filters, setFilters] = useState({
    search: '',
    moveType: '',
    page: 1,
    limit: 50
  })

  useEffect(() => {
    fetchMoveHistory()
  }, [filters])

  const fetchMoveHistory = async () => {
    setIsLoading(true)
    try {
      const params = {}
      if (filters.moveType) params.moveType = filters.moveType
      if (filters.search) params.product = filters.search
      params.page = filters.page
      params.limit = filters.limit

      const response = await dashboardService.getMoveHistory(params)
      
      // Handle response structure
      if (response.success && response.data) {
        setMoves(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setMoves([])
      }
    } catch (error) {
      console.error('Error fetching move history:', error)
      toast.error('Failed to fetch move history')
      setMoves([])
    } finally {
      setIsLoading(false)
    }
  }

  const getMovementTypeBadge = (type) => {
    const typeConfig = {
      'in': { variant: 'success', text: 'In' },
      'out': { variant: 'primary', text: 'Out' },
      'internal': { variant: 'warning', text: 'Internal' },
      'adjustment': { variant: 'secondary', text: 'Adjustment' }
    }
    
    const config = typeConfig[type] || { variant: 'secondary', text: 'Unknown' }
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Stock Movement History</h1>
        <p className="mt-2 text-sm text-gray-700">
          Track all stock movements across your warehouses
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              placeholder="Search by product..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            />
            <Select
              placeholder="All Types"
              value={filters.moveType}
              onChange={(e) => setFilters(prev => ({ ...prev, moveType: e.target.value, page: 1 }))}
            >
              <option value="">All Types</option>
              <option value="in">In</option>
              <option value="out">Out</option>
              <option value="internal">Internal</option>
              <option value="adjustment">Adjustment</option>
            </Select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {pagination.totalItems || 0} movements
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Movement History */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {moves && moves.length > 0 ? (
                  moves.map((move, index) => (
                    <tr key={move._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(move.scheduledDate || move.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {move.reference || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {move.product?.name || 'N/A'}
                        <br />
                        <span className="text-xs text-gray-400">{move.product?.sku || ''}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getMovementTypeBadge(move.moveType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {move.sourceLocation?.name || move.sourceLocation || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {move.destinationLocation?.name || move.destinationLocation || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`font-medium ${
                          move.moveType === 'in' || move.moveType === 'adjustment'
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {move.moveType === 'in' ? '+' : move.moveType === 'out' ? '-' : ''}
                          {move.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={move.status === 'done' ? 'success' : 'secondary'}>
                          {move.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="text-center">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No movement history found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Stock movements will appear here as operations are processed.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default MoveHistory