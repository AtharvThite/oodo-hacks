import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import {
  HomeIcon,
  CubeIcon,
  TruckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Button from '../common/Button'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  {
    name: 'Operations',
    icon: TruckIcon,
    children: [
      { name: 'Receipts', href: '/operations/receipts' },
      { name: 'Deliveries', href: '/operations/deliveries' },
      { name: 'Internal Transfers', href: '/operations/transfers' },
      { name: 'Adjustments', href: '/operations/adjustments' },
      { name: 'Move History', href: '/operations/move-history' },
    ],
  },
  {
    name: 'Settings',
    icon: Cog6ToothIcon,
    children: [
      { name: 'Warehouses', href: '/settings/warehouses' },
    ],
  },
]

const Sidebar = ({ mobile = false, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [expandedItems, setExpandedItems] = React.useState({})

  const handleLogout = async () => {
    try {
      await dispatch(logout())
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  const NavItem = ({ item }) => {
    if (item.children) {
      return (
        <div>
          <button
            onClick={() => toggleExpanded(item.name)}
            className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex items-center">
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </div>
            <ArrowPathIcon 
              className={`h-4 w-4 transition-transform ${
                expandedItems[item.name] ? 'rotate-90' : ''
              }`} 
            />
          </button>
          {expandedItems[item.name] && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child) => (
                <NavLink
                  key={child.name}
                  to={child.href}
                  onClick={mobile ? onClose : undefined}
                  className={({ isActive }) =>
                    `block px-2 py-2 text-sm rounded-md ${
                      isActive
                        ? 'bg-primary-100 text-primary-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {child.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <NavLink
        to={item.href}
        onClick={mobile ? onClose : undefined}
        className={({ isActive }) =>
          `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive
              ? 'bg-primary-100 text-primary-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`
        }
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
      </NavLink>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      {/* Logo and Close Button for Mobile */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center rounded bg-primary-600">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">StockMaster</span>
          </div>
          {mobile && (
            <button
              onClick={onClose}
              className="ml-auto flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>
      
      {/* User Profile Section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <div className="mt-3 space-y-1">
          <NavLink
            to="/profile"
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <UserIcon className="mr-3 h-5 w-5" />
            My Profile
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar