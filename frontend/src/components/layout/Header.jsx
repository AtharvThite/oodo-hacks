import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import SearchInput from '../common/SearchInput'
import Badge from '../common/Badge'
import Button from '../common/Button'
import UserManagement from '../admin/UserManagement'
import { fetchProducts } from '../../store/slices/productSlice'
import api from '../../store/services/api'

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth)
  const { items: products } = useSelector((state) => state.products)
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAdmin = user?.role === 'admin'

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Handle search
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results = []
    const lowerQuery = query.toLowerCase()

    // Search in products
    if (Array.isArray(products)) {
      const productMatches = products.filter(p => 
        p.name?.toLowerCase().includes(lowerQuery) ||
        p.sku?.toLowerCase().includes(lowerQuery)
      ).map(p => ({
        type: 'product',
        id: p._id,
        title: p.name,
        description: `SKU: ${p.sku}`,
        path: `/products/${p._id}`
      }))
      results.push(...productMatches)
    }

    // Search in operations
    try {
      const receiptsRes = await api.get(`/receipts?search=${query}`)
      if (Array.isArray(receiptsRes.data.receipts)) {
        const receiptMatches = receiptsRes.data.receipts.map(r => ({
          type: 'receipt',
          id: r._id,
          title: `Receipt #${r._id.slice(-6)}`,
          description: `Supplier: ${r.supplier}`,
          path: `/receipts/${r._id}`
        }))
        results.push(...receiptMatches.slice(0, 2))
      }
    } catch (error) {
      console.log('Receipt search failed')
    }

    try {
      const deliveriesRes = await api.get(`/deliveries?search=${query}`)
      if (Array.isArray(deliveriesRes.data.deliveries)) {
        const deliveryMatches = deliveriesRes.data.deliveries.map(d => ({
          type: 'delivery',
          id: d._id,
          title: `Delivery #${d._id.slice(-6)}`,
          description: `Customer: ${d.customer}`,
          path: `/deliveries/${d._id}`
        }))
        results.push(...deliveryMatches.slice(0, 2))
      }
    } catch (error) {
      console.log('Delivery search failed')
    }

    setSearchResults(results.slice(0, 5))
    setShowSearchResults(true)
  }, [products])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
        {/* Mobile menu button */}
        <button
          type="button"
          className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <div className="flex-1 px-4 flex justify-between">
          <div className="flex-1 flex">
            <div className="w-full flex md:ml-0">
              <div className="relative w-full text-gray-400 focus-within:text-gray-600" ref={searchRef}>
                <div className="flex items-center h-16">
                  <SearchInput 
                    placeholder="Search products, receipts, deliveries..."
                    className="max-w-lg"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                  />
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full max-w-lg mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
                            onClick={() => {
                              navigate(result.path)
                              setShowSearchResults(false)
                              setSearchQuery('')
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{result.title}</p>
                                <p className="text-xs text-gray-500">{result.description}</p>
                              </div>
                              <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded capitalize">
                                {result.type}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {showSearchResults && searchQuery && searchResults.length === 0 && (
                    <div className="absolute top-full left-0 w-full max-w-lg mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4">
                      <p className="text-sm text-gray-500 text-center">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex items-center md:ml-6 space-x-4">
            {/* Admin - Manage Access Button */}
            {isAdmin && (
              <Button
                size="small"
                onClick={() => setIsUserManagementOpen(true)}
              >
                Manage Access
              </Button>
            )}

            {/* Notifications */}
            <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <BellIcon className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <div className="flex items-center text-sm">
              <span className="hidden md:block mr-3">
                Welcome back, <span className="font-medium">{user?.name}</span>
              </span>
              <Badge variant="primary" size="small">
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Modal */}
      <UserManagement 
        isOpen={isUserManagementOpen} 
        onClose={() => setIsUserManagementOpen(false)} 
      />
    </>
  )
}

export default Header