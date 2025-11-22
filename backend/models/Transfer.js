const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true,
    trim: true
  },
  sourceLocation: {
    type: String,
    required: [true, 'Source location is required']
  },
  destinationLocation: {
    type: String,
    required: [true, 'Destination location is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'cancelled'],
    default: 'draft'
  },
  transferType: {
    type: String,
    enum: ['internal', 'inter-warehouse'],
    default: 'internal'
  },
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be greater than 0']
    },
    transferredQuantity: {
      type: Number,
      min: [0, 'Transferred quantity cannot be negative'],
      default: 0
    },
    notes: String
  }],
  reason: {
    type: String,
    enum: ['production', 'quality_check', 'reorganization', 'damage', 'other'],
    default: 'other'
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

// Validation: source and destination locations must be different
transferSchema.pre('save', function(next) {
  if (this.sourceLocation && this.destinationLocation && 
      this.sourceLocation.toString() === this.destinationLocation.toString()) {
    next(new Error('Source and destination locations must be different'));
  }
  next();
});

// Generate reference number
transferSchema.pre('save', async function(next) {
  if (this.isNew && !this.reference) {
    const count = await this.constructor.countDocuments();
    this.reference = `WH/INT/${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Transfer', transferSchema);