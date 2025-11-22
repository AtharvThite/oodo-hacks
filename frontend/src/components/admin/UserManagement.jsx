import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, createUser, updateUserRole, deleteUser, clearError } from '../../store/slices/userSlice'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '../common/Card'
import Button from '../common/Button'
import Input from '../common/Input'
import Select from '../common/Select'
import LoadingSpinner from '../common/LoadingSpinner'
import Badge from '../common/Badge'
import { XMarkIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'

const UserManagement = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { items: users, isLoading, isCreating, isUpdating, isDeleting, error } = useSelector(state => state.users)
  const { user: currentUser } = useSelector(state => state.auth)
  const [editingId, setEditingId] = useState(null)
  const [editingRole, setEditingRole] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUsers({ page: 1, limit: 50 }))
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleCreateUser = async (data) => {
    try {
      await dispatch(createUser(data)).unwrap()
      toast.success('User created successfully')
      reset()
      setShowAddForm(false)
    } catch (error) {
      toast.error(error || 'Failed to create user')
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap()
      toast.success('User role updated successfully')
      setEditingId(null)
      setEditingRole('')
    } catch (error) {
      toast.error(error || 'Failed to update role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUser(userId)).unwrap()
        toast.success('User deleted successfully')
      } catch (error) {
        toast.error(error || 'Failed to delete user')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Add User Button */}
          <div className="flex justify-end">
            <Button
              icon={PlusIcon}
              onClick={() => setShowAddForm(!showAddForm)}
              variant="primary"
            >
              {showAddForm ? 'Cancel' : 'Add New User'}
            </Button>
          </div>

          {/* Add User Form */}
          {showAddForm && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
                <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter user's full name"
                      error={errors.name?.message}
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter user's email"
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                  </div>
                  <Select
                    label="Role"
                    error={errors.role?.message}
                    {...register('role', {
                      required: 'Role is required'
                    })}
                  >
                    <option value="">Select role</option>
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </Select>
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isCreating}
                      disabled={isCreating}
                    >
                      Create User
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          )}

          {/* Users Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {editingId === user._id ? (
                          <select
                            value={editingRole}
                            onChange={(e) => setEditingRole(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'warning' : 'success'}>
                            {user.role}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant={user.isActive ? 'success' : 'warning'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        {editingId === user._id ? (
                          <>
                            <Button
                              size="small"
                              variant="success"
                              onClick={() => handleUpdateRole(user._id, editingRole)}
                              isLoading={isUpdating}
                              disabled={isUpdating}
                            >
                              Save
                            </Button>
                            <Button
                              size="small"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            {currentUser._id !== user._id && (
                              <>
                                <Button
                                  size="small"
                                  icon={PencilIcon}
                                  variant="outline"
                                  onClick={() => {
                                    setEditingId(user._id)
                                    setEditingRole(user.role)
                                  }}
                                >
                                  Edit Role
                                </Button>
                                <Button
                                  size="small"
                                  icon={TrashIcon}
                                  variant="danger"
                                  onClick={() => handleDeleteUser(user._id)}
                                  isLoading={isDeleting}
                                  disabled={isDeleting}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                            {currentUser._id === user._id && (
                              <span className="text-gray-400 text-xs italic">Your account</span>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserManagement
