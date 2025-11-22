const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true,
    trim: true
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true
    },
    email: String,
    phone: String,
    address: String
  },
  warehouse: {
    type: mongoose.Schema.ObjectId,
    ref: 'Warehouse',
    required: [true, 'Warehouse is required']
  },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: [true, 'Location is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    default: Date.now
  },
  receivedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'cancelled'],
    default: 'draft'
  },
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    expectedQuantity: {
      type: Number,
      required: [true, 'Expected quantity is required'],
      min: [0.01, 'Expected quantity must be greater than 0']
    },
    receivedQuantity: {
      type: Number,
      min: [0, 'Received quantity cannot be negative'],
      default: 0
    },
    unitPrice: {
      type: Number,
      min: [0, 'Unit price cannot be negative'],
      default: 0
    },
    notes: String
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  responsible: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate reference number
receiptSchema.pre('save', async function(next) {
  if (this.isNew && !this.reference) {
    const count = await this.constructor.countDocuments();
    this.reference = `WH/IN/${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Receipt', receiptSchema);