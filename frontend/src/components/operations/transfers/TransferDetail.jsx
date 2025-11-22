import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransfer } from '../../../store/slices/transferSlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const TransferDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentTransfer: transfer, isLoading } = useSelector(state => state.transfers)

  useEffect(() => {
    if (id) {
      dispatch(fetchTransfer(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!transfer) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Transfer not found</h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          icon={ArrowLeftIcon}
          onClick={() => navigate('/operations/transfers')}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {transfer.transferNumber}
          </h1>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Transfer Details
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">From Warehouse</dt>
              <dd className="mt-1 text-sm text-gray-900">{transfer.fromWarehouse?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">To Warehouse</dt>
              <dd className="mt-1 text-sm text-gray-900">{transfer.toWarehouse?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Transfer Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(transfer.transferDate).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  )
}

export default TransferDetail