const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Location code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required']
  },
  type: {
    type: String,
    enum: ['storage', 'picking', 'packing', 'receiving', 'quality', 'damaged', 'other'],
    default: 'storage'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  capacity: {
    type: Number,
    min: [0, 'Capacity cannot be negative'],
    default: 0
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

// Index for better query performance
locationSchema.index({ warehouse: 1, code: 1 });
locationSchema.index({ warehouse: 1, isActive: 1 });

module.exports = mongoose.model('Location', locationSchema);
