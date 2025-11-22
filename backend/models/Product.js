const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [50, 'SKU cannot exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Unit of measure is required'],
    enum: ['pieces', 'kg', 'liters', 'meters', 'boxes', 'tons'],
    default: 'pieces'
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative'],
    default: 0
  },
  sellingPrice: {
    type: Number,
    min: [0, 'Selling price cannot be negative'],
    default: 0
  },
  minStockLevel: {
    type: Number,
    min: [0, 'Minimum stock level cannot be negative'],
    default: 0
  },
  maxStockLevel: {
    type: Number,
    min: [0, 'Maximum stock level cannot be negative'],
    default: 1000
  },
  reorderPoint: {
    type: Number,
    min: [0, 'Reorder point cannot be negative'],
    default: 10
  },
  barcode: {
    type: String,
    sparse: true,
    trim: true
  },
  image: {
    type: String, // URL or base64
    default: null
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

// Virtual for current stock (will be calculated from stock moves)
productSchema.virtual('currentStock', {
  ref: 'StockMove',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

// Index for better search performance
productSchema.index({ name: 'text', sku: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });

module.exports = mongoose.model('Product', productSchema);