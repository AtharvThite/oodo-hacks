import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'

const StockAlerts = () => {
  const { alerts } = useSelector((state) => state.dashboard)

  // Ensure alerts is always an array
  const safeAlerts = Array.isArray(alerts) ? alerts : []

  if (safeAlerts.length === 0) {
    return null
  }

  return (
    <Card className="border-l-4 border-l-warning-500">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-warning-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Stock Alerts ({safeAlerts.length})
            </h3>
          </div>
          <Link to="/products?filter=low-stock">
            <Button variant="outline" size="small">
              View All
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {safeAlerts.slice(0, 3).map((alert) => (
            <div key={alert.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {alert.type === 'out_of_stock' ? (
                    <XCircleIcon className="h-5 w-5 text-danger-500" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {alert.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    SKU: {alert.product.sku}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.currentStock} units
                  </p>
                  <p className="text-xs text-gray-500">
                    Reorder at: {alert.reorderPoint}
                  </p>
                </div>
                <Badge 
                  variant={alert.type === 'out_of_stock' ? 'danger' : 'warning'}
                >
                  {alert.type === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {alerts.length > 3 && (
          <div className="mt-3 text-center">
            <Link to="/products?filter=alerts" className="text-sm text-primary-600 hover:text-primary-500">
              View {alerts.length - 3} more alerts
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}

export default StockAlerts