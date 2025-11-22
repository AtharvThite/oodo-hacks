import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReceipt } from '../../../store/slices/receiptSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const ReceiptDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentReceipt: receipt, isLoading } = useSelector(state => state.receipts)

  useEffect(() => {
    if (id) {
      dispatch(fetchReceipt(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Receipt not found</h3>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { variant: 'secondary', text: 'Draft' },
      confirmed: { variant: 'primary', text: 'Confirmed' },
      received: { variant: 'success', text: 'Received' },
      cancelled: { variant: 'danger', text: 'Cancelled' }
    }
    
    const config = statusConfig[status] || statusConfig.draft
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon={ArrowLeftIcon}
            onClick={() => navigate('/operations/receipts')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {receipt.receiptNumber}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Supplier: {receipt.supplier}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(receipt.status)}
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Receipt Details
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Warehouse</dt>
              <dd className="mt-1 text-sm text-gray-900">{receipt.warehouse?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Expected Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(receipt.expectedDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Value</dt>
              <dd className="mt-1 text-sm text-gray-900">${receipt.totalValue?.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  )
}

export default ReceiptDetail