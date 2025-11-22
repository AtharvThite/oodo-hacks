import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '../common/Card'
import SearchInput from '../common/SearchInput'
import Select from '../common/Select'
import Badge from '../common/Badge'
import LoadingSpinner from '../common/LoadingSpinner'

const MoveHistory = () => {
  const [moves, setMoves] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  })

  const getMovementTypeBadge = (type) => {
    const typeConfig = {
      'receipt': { variant: 'success', text: 'Receipt' },
      'delivery': { variant: 'primary', text: 'Delivery' },
      'transfer': { variant: 'warning', text: 'Transfer' },
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchInput
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <Select
              placeholder="All Types"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="receipt">Receipt</option>
              <option value="delivery">Delivery</option>
              <option value="transfer">Transfer</option>
              <option value="adjustment">Adjustment</option>
            </Select>
            <input
              type="date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="From Date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
            <input
              type="date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="To Date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
        </div>
      </Card>

      {/* Movement History */}
      <Card>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {moves && moves.length > 0 ? (
                moves.map((move, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(move.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {move.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getMovementTypeBadge(move.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {move.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-medium ${
                        move.movementType === 'in' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {move.movementType === 'in' ? '+' : '-'}{move.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {move.reference}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
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
      </Card>
    </div>
  )
}

export default MoveHistory