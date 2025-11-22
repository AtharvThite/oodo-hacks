import React from 'react'
import { useSelector } from 'react-redux'
import {
  CubeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  TruckIcon,
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
} from '@heroicons/react/24/outline'
import Card from '../common/Card'

const KPICards = () => {
  const { kpis } = useSelector((state) => state.dashboard)

  const kpiData = [
    {
      name: 'Total Products',
      value: kpis.inventory?.totalProducts || 0,
      icon: CubeIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      name: 'Total Stock Value',
      value: `${kpis.inventory?.totalInStock || 0} units`,
      icon: ArchiveBoxArrowDownIcon,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      name: 'Low Stock Items',
      value: kpis.inventory?.lowStockCount || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      name: 'Out of Stock',
      value: kpis.inventory?.outOfStockCount || 0,
      icon: XCircleIcon,
      color: 'text-danger-600',
      bgColor: 'bg-danger-100',
    },
    {
      name: 'Pending Receipts',
      value: kpis.operations?.pendingReceipts || 0,
      icon: TruckIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Pending Deliveries',
      value: kpis.operations?.pendingDeliveries || 0,
      icon: ArchiveBoxXMarkIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiData.map((item) => (
        <Card key={item.name} className="p-5">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-md ${item.bgColor}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{item.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default KPICards