import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Moon, Sun, Search, Package, Truck, FileText, ShieldCheck, ChevronDown, User } from 'lucide-react'
import Badge from '../common/Badge'
import Button from '../common/Button'
import UserManagement from '../admin/UserManagement'
import { fetchProducts } from '../../store/slices/productSlice'
import api from '../../store/services/api'
import { useTheme } from '../../context/ThemeContext'

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

  const { theme, toggleTheme } = useTheme()

  const getSearchIcon = (type) => {
    switch(type) {
      case 'product': return Package
      case 'receipt': return FileText
      case 'delivery': return Truck
      default: return Package
    }
  }

  return (
    <>
      <div className="relative z-10 flex-shrink-0 flex h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50 shadow-lg transition-colors duration-300">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />
        
        {/* Mobile menu button */}
        <button
          type="button"
          className="px-4 border-r border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden transition-all"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex-1 px-4 flex justify-between items-center">
          <div className="flex-1 flex items-center">
            <div className="w-full flex md:ml-0">
              <div className="relative w-full" ref={searchRef}>
                <div className="flex items-center">
                  {/* Enhanced Search Input */}
                  <div className="relative max-w-xl w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                      placeholder="Search products, receipts, deliveries..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchResults(true)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSearchResults([])
                          setShowSearchResults(false)
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <span className="text-xs font-medium">✕</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-full max-w-xl mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Search Results</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((result) => {
                          const IconComponent = getSearchIcon(result.type)
                          return (
                            <button
                              key={`${result.type}-${result.id}`}
                              className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-slate-700/30 dark:hover:to-slate-700/30 border-b border-slate-200 dark:border-slate-700/30 last:border-b-0 transition-all group"
                              onClick={() => {
                                navigate(result.path)
                                setShowSearchResults(false)
                                setSearchQuery('')
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/50 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors flex-shrink-0">
                                  <IconComponent className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{result.title}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{result.description}</p>
                                </div>
                                <span className="ml-2 px-2.5 py-1 text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg capitalize border border-primary-500/20 flex-shrink-0">
                                  {result.type}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {showSearchResults && searchQuery && searchResults.length === 0 && (
                    <div className="absolute top-full left-0 w-full max-w-lg mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 p-4 animate-fade-in">
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex items-center md:ml-6 gap-2">
            {/* Admin - Manage Access Button */}
            {isAdmin && (
              <button
                onClick={() => setIsUserManagementOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all hover:scale-105"
              >
                <ShieldCheck className="h-4 w-4" />
                Manage Access
              </button>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
              aria-label="Toggle theme"
            >
              <div className="relative">
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </div>
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group">
              <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </button>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-2 ml-2 border-l border-slate-200 dark:border-slate-700">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</span>
              </div>
              <div className="relative group cursor-pointer">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg group-hover:shadow-primary-500/50 transition-all group-hover:scale-110">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
              </div>
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