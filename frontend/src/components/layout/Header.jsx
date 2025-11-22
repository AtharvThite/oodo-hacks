import React from 'react'
import { useSelector } from 'react-redux'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'
import SearchInput from '../common/SearchInput'
import Badge from '../common/Badge'

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth)

  return (
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
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="flex items-center h-16">
                <SearchInput 
                  placeholder="Search products, receipts, deliveries..."
                  className="max-w-lg"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications */}
          <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
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
    </div>
  )
}

export default Header