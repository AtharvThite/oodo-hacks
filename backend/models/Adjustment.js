const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  adjustmentDate: {
    type: Date,
    required: [true, 'Adjustment date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'ready', 'done', 'cancelled'],
    default: 'draft'
  },
  adjustmentType: {
    type: String,
    enum: ['physical_count', 'damage', 'loss', 'found', 'correction'],
    required: [true, 'Adjustment type is required']
  },
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    theoreticalQuantity: {
      type: Number,
      required: [true, 'Theoretical quantity is required'],
      min: [0, 'Theoretical quantity cannot be negative']
    },
    actualQuantity: {
      type: Number,
      required: [true, 'Actual quantity is required'],
      min: [0, 'Actual quantity cannot be negative']
    },
    difference: {
      type: Number,
      default: function() {
        return this.actualQuantity - this.theoreticalQuantity;
      }
    },
    reason: String,
    notes: String
  }],
  reason: {
    type: String,
    required: [true, 'Adjustment reason is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  responsible: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate difference before saving
adjustmentSchema.pre('save', function(next) {
  if (this.products) {
    this.products.forEach(product => {
      product.difference = product.actualQuantity - product.theoreticalQuantity;
    });
  }
  next();
});

// Generate reference number
adjustmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.reference) {
    const count = await this.constructor.countDocuments();
    this.reference = `WH/ADJ/${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Adjustment', adjustmentSchema);