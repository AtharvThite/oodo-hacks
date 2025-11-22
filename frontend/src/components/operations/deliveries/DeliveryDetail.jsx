import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDelivery } from '../../../store/slices/deliverySlice'
import Card from '../../common/Card'
import Button from '../../common/Button'
import Badge from '../../common/Badge'
import LoadingSpinner from '../../common/LoadingSpinner'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const DeliveryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentDelivery: delivery, isLoading } = useSelector(state => state.deliveries)

  useEffect(() => {
    if (id) {
      dispatch(fetchDelivery(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!delivery) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Delivery not found</h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          icon={ArrowLeftIcon}
          onClick={() => navigate('/operations/deliveries')}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {delivery.deliveryNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Customer: {delivery.customer}
          </p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delivery Details
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Warehouse</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.warehouse?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(delivery.scheduledDate).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  )
}

export default DeliveryDetail