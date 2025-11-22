import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import reportsService from '../../store/services/reportsService'
import Card from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Reports = () => {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('products')
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  })

  const reports = {
    products: {
      title: 'Product Inventory Report',
      description: 'Complete inventory status of all products with stock levels, valuation, and reorder points',
      icon: '📦',
      columns: ['sku', 'name', 'category', 'currentStock', 'minStockLevel', 'reorderPoint', 'status', 'stockValue']
    },
    deliveries: {
      title: 'Delivery Report',
      description: 'All delivery orders with customer info, status, and items count',
      icon: '🚚',
      columns: ['deliveryNumber', 'customer', 'warehouse', 'status', 'items', 'value', 'createdAt']
    },
    receipts: {
      title: 'Receipt Report',
      description: 'All purchase receipts with supplier information and received quantities',
      icon: '📥',
      columns: ['receiptNumber', 'supplier', 'warehouse', 'status', 'items', 'value', 'createdAt']
    },
    transfers: {
      title: 'Transfer Report',
      description: 'Internal stock transfers between warehouses or locations',
      icon: '🔄',
      columns: ['transferNumber', 'from', 'to', 'status', 'items', 'reason']
    },
    stockMovement: {
      title: 'Stock Movement Report',
      description: 'Detailed log of all stock movements (inbound/outbound)',
      icon: '📊',
      columns: ['product', 'sku', 'type', 'quantity', 'reference', 'completedDate']
    },
    summary: {
      title: 'Warehouse Summary Report',
      description: 'Overall warehouse statistics and stock valuation',
      icon: '📈',
      columns: ['totalProducts', 'totalStockValue', 'lowStockItems', 'outOfStockItems']
    }
  }

  const handleGenerateReport = async (reportType) => {
    setIsLoading(true)
    try {
      let data;

      switch (reportType) {
        case 'products':
          data = await reportsService.getProductReport(filters)
          break
        case 'deliveries':
          data = await reportsService.getDeliveryReport(filters)
          break
        case 'receipts':
          data = await reportsService.getReceiptReport(filters)
          break
        case 'transfers':
          data = await reportsService.getTransferReport(filters)
          break
        case 'stockMovement':
          data = await reportsService.getStockMovementReport(filters)
          break
        case 'summary':
          data = await reportsService.getWarehouseSummary()
          if (!Array.isArray(data)) {
            data = [data]
          }
          break
        default:
          return
      }

      setReportData({
        type: reportType,
        data: Array.isArray(data) ? data : data.data || [data],
        summary: data.summary || null
      })
      toast.success('Report generated successfully')
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error(error.message || 'Failed to generate report')
      setReportData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = (format) => {
    if (!reportData) {
      toast.error('No report data to export')
      return
    }

    const filename = `${reportData.type}-report`
    const data = reportData.data

    if (format === 'csv') {
      reportsService.exportToCSV(data, filename, reports[reportData.type].columns)
      toast.success('Report exported as CSV')
    } else if (format === 'json') {
      reportsService.exportToJSON(data, filename)
      toast.success('Report exported as JSON')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Generate and export business intelligence reports
        </p>
      </div>

      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(reports).map(([key, report]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              activeTab === key ? 'ring-2 ring-primary-600' : ''
            }`}
            onClick={() => setActiveTab(key)}
          >
            <div className="p-4">
              <div className="text-3xl mb-2">{report.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{report.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTab(key)
                  handleGenerateReport(key)
                }}
                className="mt-4 w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition text-sm font-medium"
              >
                Generate Report
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Details */}
      {reportData && (
        <Card>
          <div className="p-6">
            {/* Report Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {reports[reportData.type].title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generated on {new Date().toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleExport('csv')}
                  icon={ArrowDownTrayIcon}
                >
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleExport('json')}
                  icon={ArrowDownTrayIcon}
                >
                  JSON
                </Button>
              </div>
            </div>

            {/* Report Summary */}
            {reportData.summary && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(reportData.summary).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-600 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-lg font-semibold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {reports[reportData.type].columns.map((column) => (
                      <th
                        key={column}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.data.length > 0 ? (
                    reportData.data.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {reports[reportData.type].columns.map((column) => (
                          <td
                            key={column}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {renderCellValue(row[column])}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={reports[reportData.type].columns.length}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No data available for this report
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Data Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {reportData.data.length} records
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <div className="p-12 flex items-center justify-center">
            <LoadingSpinner size="large" />
            <span className="ml-4 text-gray-600">Generating report...</span>
          </div>
        </Card>
      )}

      {/* No Report Selected */}
      {!reportData && !isLoading && (
        <Card>
          <div className="p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Report Generated Yet
            </h3>
            <p className="text-gray-600">
              Select a report type above and click "Generate Report" to view detailed statistics
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

// Helper function to render cell values
function renderCellValue(value) {
  if (value === null || value === undefined) {
    return 'N/A'
  }

  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="h-4 w-4 mr-1" />
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
        No
      </span>
    )
  }

  if (value instanceof Date) {
    return new Date(value).toLocaleDateString()
  }

  if (typeof value === 'string' && value.includes('Stock')) {
    const color =
      value === 'Out of Stock'
        ? 'bg-red-100 text-red-800'
        : value === 'Low Stock'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800'

    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {value}
      </span>
    )
  }

  if (typeof value === 'number') {
    // Check if it looks like a price
    if (value > 100) {
      return `$${value.toFixed(2)}`
    }
    return value
  }

  return value
}

export default Reports
