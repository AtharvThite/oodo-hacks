import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const RecentOperations = () => {
  const { recentOperations } = useSelector((state) => state.dashboard)

  const getStatusVariant = (status) => {
    switch (status) {
      case 'done':
        return 'success'
      case 'ready':
        return 'primary'
      case 'waiting':
        return 'warning'
      case 'draft':
        return 'gray'
      case 'cancelled':
        return 'danger'
      default:
        return 'gray'
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, HH:mm')
    } catch {
      return 'Invalid date'
    }
  }

  const OperationRow = ({ operation, type, linkBase }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {operation.reference}
            </p>
            <p className="text-sm text-gray-500">
              {type === 'receipts' && operation.supplier?.name}
              {type === 'deliveries' && operation.customer?.name}
              {type === 'transfers' && (
                <span>
                  {operation.sourceLocation?.name} → {operation.destinationLocation?.name}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant={getStatusVariant(operation.status)}>
          {operation.status}
        </Badge>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {formatDate(operation.scheduledDate || operation.createdAt)}
          </p>
        </div>
        <Link to={`${linkBase}/${operation._id}`}>
          <Button variant="outline" size="small" icon={ArrowTopRightOnSquareIcon}>
            View
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Operations
          </h3>
          <div className="flex space-x-2">
            <Link to="/operations/receipts">
              <Button variant="outline" size="small">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <span className="border-primary-500 text-primary-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Receipts ({recentOperations.receipts?.length || 0})
            </span>
            <span className="border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer">
              Deliveries ({recentOperations.deliveries?.length || 0})
            </span>
            <span className="border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer">
              Transfers ({recentOperations.transfers?.length || 0})
            </span>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-1">
          {recentOperations.receipts && recentOperations.receipts.length > 0 ? (
            recentOperations.receipts.slice(0, 5).map((receipt) => (
              <OperationRow
                key={receipt._id}
                operation={receipt}
                type="receipts"
                linkBase="/operations/receipts"
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent receipts</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default RecentOperations