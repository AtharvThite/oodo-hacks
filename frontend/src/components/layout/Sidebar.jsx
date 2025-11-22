import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import {
  Home,
  Package,
  Truck,
  ChevronRight,
  User,
  LogOut,
  X,
  Warehouse,
  BarChart3,
  Settings,
} from 'lucide-react'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
  {
    name: 'Operations',
    icon: Truck,
    children: [
      { name: 'Receipts', href: '/operations/receipts' },
      { name: 'Deliveries', href: '/operations/deliveries' },
      { name: 'Internal Transfers', href: '/operations/transfers' },
      { name: 'Adjustments', href: '/operations/adjustments' },
      { name: 'Move History', href: '/operations/move-history' },
    ],
  },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  {
    name: 'Settings',
    icon: Settings,
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
    const Icon = item.icon
    
    if (item.children) {
      return (
        <div>
          <button
            onClick={() => toggleExpanded(item.name)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              {item.name}
            </div>
            <ChevronRight 
              className={`h-4 w-4 transition-transform duration-200 ${
                expandedItems[item.name] ? 'rotate-90' : ''
              }`} 
            />
          </button>
          {expandedItems[item.name] && (
            <div className="ml-8 mt-1 space-y-1 animate-fade-in">
              {item.children.map((child) => (
                <NavLink
                  key={child.name}
                  to={child.href}
                  onClick={mobile ? onClose : undefined}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold shadow-lg shadow-primary-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
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
          `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
            isActive
              ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
          }`
        }
      >
        <Icon className="h-5 w-5" />
        {item.name}
      </NavLink>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-colors duration-300">
      {/* Logo and Close Button for Mobile */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/30">
              <Warehouse className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-lg font-bold text-slate-900 dark:text-white">StockMaster</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Inventory System</span>
            </div>
          </div>
          {mobile && (
            <button
              onClick={onClose}
              className="ml-auto flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
      </div>
      
      {/* User Profile Section */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center shadow-inner">
              <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <NavLink
            to="/profile"
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <User className="h-4 w-4" />
            My Profile
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar