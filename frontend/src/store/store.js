import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authSlice from './slices/authSlice'
import dashboardSlice from './slices/dashboardSlice'
import productSlice from './slices/productSlice'
import warehouseSlice from './slices/warehouseSlice'
import receiptSlice from './slices/receiptSlice'
import deliverySlice from './slices/deliverySlice'
import transferSlice from './slices/transferSlice'
import adjustmentSlice from './slices/adjustmentSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state
}

const rootReducer = combineReducers({
  auth: authSlice,
  dashboard: dashboardSlice,
  products: productSlice,
  warehouses: warehouseSlice,
  receipts: receiptSlice,
  deliveries: deliverySlice,
  transfers: transferSlice,
  adjustments: adjustmentSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)