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

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { variant: 'secondary', text: 'Draft' },
      waiting: { variant: 'warning', text: 'Waiting' },
      ready: { variant: 'primary', text: 'Ready' },
      done: { variant: 'success', text: 'Done' },
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
            onClick={() => navigate('/operations/deliveries')}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {delivery.reference}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Customer: {delivery.customer?.name || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(delivery.status)}
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Delivery Information
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.customer?.name || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Customer Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.customer?.email || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Customer Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.customer?.phone || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Customer Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.customer?.address || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Warehouse</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.warehouse?.name || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Source Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.sourceLocation || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(delivery.scheduledDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">{getStatusBadge(delivery.status)}</dd>
            </div>
          </dl>

          {delivery.notes && (
            <div className="mt-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.notes}</dd>
            </div>
          )}
        </div>
      </Card>

      {delivery.products && delivery.products.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Products
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {delivery.products.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.product?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.product?.sku || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.requestedQuantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.unitPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${((item.requestedQuantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="text-lg font-semibold text-gray-900">
                Grand Total: ${delivery.products.reduce((sum, item) => 
                  sum + ((item.requestedQuantity || 0) * (item.unitPrice || 0)), 0
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default DeliveryDetail