const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true,
    trim: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
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
  sourceLocation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: [true, 'Source location is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    default: Date.now
  },
  deliveredDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'cancelled'],
    default: 'draft'
  },
  operationType: {
    type: String,
    enum: ['delivery', 'return'],
    default: 'delivery'
  },
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    requestedQuantity: {
      type: Number,
      required: [true, 'Requested quantity is required'],
      min: [0.01, 'Requested quantity must be greater than 0']
    },
    deliveredQuantity: {
      type: Number,
      min: [0, 'Delivered quantity cannot be negative'],
      default: 0
    },
    unitPrice: {
      type: Number,
      min: [0, 'Unit price cannot be negative'],
      default: 0
    },
    notes: String
  }],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  carrier: {
    name: String,
    trackingNumber: String
  },
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
deliverySchema.pre('save', async function(next) {
  if (this.isNew && !this.reference) {
    const count = await this.constructor.countDocuments();
    this.reference = `WH/OUT/${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Delivery', deliverySchema);