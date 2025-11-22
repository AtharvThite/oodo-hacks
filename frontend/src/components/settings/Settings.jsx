import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../common/Card'
import Button from '../common/Button'
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Settings = () => {
  const settingsItems = [
    {
      title: 'Warehouses',
      description: 'Manage warehouse locations and storage facilities',
      icon: BuildingOfficeIcon,
      link: '/settings/warehouses',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: UserGroupIcon,
      link: '/settings/users',
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'System Configuration',
      description: 'Configure system-wide settings and preferences',
      icon: Cog6ToothIcon,
      link: '/settings/system',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Security Settings',
      description: 'Manage security policies and authentication',
      icon: ShieldCheckIcon,
      link: '/settings/security',
      color: 'text-red-600 bg-red-100'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-700">
          Configure your system settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <Card key={index}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${item.color} mr-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>
                
                <Link to={item.link}>
                  <Button variant="outline" size="small" className="w-full">
                    Configure
                  </Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Settings