import React from 'react'
import { useSelector } from 'react-redux'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

const Profile = () => {
  const { user } = useSelector(state => state.auth)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Personal Information
              </h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    defaultValue={user?.firstName || ''}
                    icon={UserIcon}
                  />
                  
                  <Input
                    label="Last Name"
                    defaultValue={user?.lastName || ''}
                    icon={UserIcon}
                  />
                </div>
                
                <Input
                  label="Email Address"
                  type="email"
                  defaultValue={user?.email || ''}
                  icon={EnvelopeIcon}
                  disabled
                />
                
                <Input
                  label="Phone Number"
                  defaultValue={user?.phone || ''}
                  icon={PhoneIcon}
                />
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Update Profile
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Account Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Member since:</span>
                  <span className="text-sm text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Last login:</span>
                  <span className="text-sm text-gray-900">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile