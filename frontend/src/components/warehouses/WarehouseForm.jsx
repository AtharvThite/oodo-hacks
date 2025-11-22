import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createWarehouse, updateWarehouse, fetchWarehouse } from '../../store/slices/warehouseSlice'
import { Warehouse, MapPin, User, Phone, Mail } from 'lucide-react'

const WarehouseForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentWarehouse, isCreating, isUpdating } = useSelector(state => state.warehouses)
  
  const isEditing = Boolean(id)
  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchWarehouse(id))
    } else {
      // Clear form when creating new warehouse
      reset({
        name: '',
        code: '',
        address: '',
        manager: '',
        phone: '',
        email: '',
        isActive: true
      })
    }
  }, [dispatch, id, isEditing, reset])

  useEffect(() => {
    if (isEditing && currentWarehouse) {
      reset({
        name: currentWarehouse.name || '',
        code: currentWarehouse.code || '',
        address: currentWarehouse.address || '',
        manager: currentWarehouse.manager || '',
        phone: currentWarehouse.phone || '',
        email: currentWarehouse.email || '',
        isActive: currentWarehouse.isActive !== undefined ? currentWarehouse.isActive : true
      })
    }
  }, [currentWarehouse, isEditing, reset])

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await dispatch(updateWarehouse({ id, data })).unwrap()
        toast.success('Warehouse updated successfully')
      } else {
        await dispatch(createWarehouse(data)).unwrap()
        toast.success('Warehouse created successfully')
      }
      navigate('/warehouses')
    } catch (error) {
      toast.error(error || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative space-y-6 px-4 py-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
            <Warehouse className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Warehouse' : 'New Warehouse'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {isEditing ? 'Update warehouse information' : 'Create a new warehouse location'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <span className="text-amber-600 dark:text-amber-400 text-sm font-bold">1</span>
              </span>
              Basic Information
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Warehouse Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    {...register('name', {
                      required: 'Warehouse name is required'
                    })}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Warehouse Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    {...register('code', {
                      required: 'Warehouse code is required',
                      pattern: {
                        value: /^[A-Z0-9-_]+$/,
                        message: 'Code can only contain uppercase letters, numbers, hyphens, and underscores'
                      }
                    })}
                  />
                  {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <textarea
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                    placeholder="Enter warehouse address..."
                    {...register('address')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <User className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </span>
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Manager Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      placeholder="Enter manager name"
                      {...register('manager')}
                    />
                  </div>
                  {errors.manager && <p className="mt-1 text-sm text-red-500">{errors.manager.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      placeholder="Enter phone number"
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      placeholder="Enter email address"
                      {...register('email', {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      id="isActive"
                      type="checkbox"
                      className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-600 rounded transition-colors"
                      {...register('isActive')}
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Active Warehouse
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button
              type="button"
              onClick={() => navigate('/warehouses')}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/30"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditing ? 'Update Warehouse' : 'Create Warehouse'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WarehouseForm