import React from 'react'
import { Link } from 'react-router-dom'
import {
  PlusIcon,
  CubeIcon,
  TruckIcon,
  ArchiveBoxArrowDownIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import Card from '../common/Card'
import Button from '../common/Button'

const QuickActions = () => {
  const actions = [
    {
      name: 'New Product',
      description: 'Add a new product to inventory',
      href: '/products/new',
      icon: CubeIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      name: 'Create Receipt',
      description: 'Record incoming stock',
      href: '/operations/receipts/new',
      icon: ArchiveBoxArrowDownIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      name: 'Create Delivery',
      description: 'Process outgoing stock',
      href: '/operations/deliveries/new',
      icon: TruckIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Internal Transfer',
      description: 'Move stock between locations',
      href: '/operations/transfers/new',
      icon: ArrowPathIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      name: 'Stock Adjustment',
      description: 'Adjust inventory levels',
      href: '/operations/adjustments/new',
      icon: AdjustmentsHorizontalIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
  ]

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Quick Actions
        </h3>
        
        <div className="space-y-4">
          {actions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-md ${action.bgColor}`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
                <PlusIcon className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/operations/move-history">
              <Button variant="outline" size="small" className="w-full">
                Move History
              </Button>
            </Link>
            <Link to="/products/reports/low-stock">
              <Button variant="outline" size="small" className="w-full">
                Stock Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default QuickActions