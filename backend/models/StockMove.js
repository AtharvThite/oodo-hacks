const mongoose = require('mongoose');

const stockMoveSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true,
    trim: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  sourceLocation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: function() {
      return this.moveType !== 'in';
    }
  },
  destinationLocation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: function() {
      return this.moveType !== 'out';
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than 0']
  },
  unitPrice: {
    type: Number,
    min: [0, 'Unit price cannot be negative'],
    default: 0
  },
  moveType: {
    type: String,
    enum: ['in', 'out', 'internal', 'adjustment'],
    required: [true, 'Move type is required']
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'cancelled'],
    default: 'draft'
  },
  scheduledDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  parentDocument: {
    documentType: {
      type: String,
      enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
      required: true
    },
    documentId: {
      type: mongoose.Schema.ObjectId,
      required: true
    }
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
stockMoveSchema.index({ product: 1, status: 1 });
stockMoveSchema.index({ sourceLocation: 1 });
stockMoveSchema.index({ destinationLocation: 1 });
stockMoveSchema.index({ 'parentDocument.documentType': 1, 'parentDocument.documentId': 1 });
stockMoveSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('StockMove', stockMoveSchema);