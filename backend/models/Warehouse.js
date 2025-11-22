const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Warehouse name is required'],
    trim: true,
    maxlength: [100, 'Warehouse name cannot exceed 100 characters']
  },
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Short code cannot exceed 10 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  shortCode: {
    type: String,
    required: [true, 'Location short code is required'],
    uppercase: true,
    trim: true
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required']
  },
  type: {
    type: String,
    enum: ['storage', 'input', 'output', 'internal', 'production'],
    default: 'storage'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure unique location code within warehouse
locationSchema.index({ warehouse: 1, shortCode: 1 }, { unique: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
const Location = mongoose.model('Location', locationSchema);

module.exports = { Warehouse, Location };