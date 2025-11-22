const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const StockMove = require('../models/StockMove');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Private
router.get('/', auth, [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),
  query('category')
    .optional()
    .trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const { search, category, sortBy = 'name', sortOrder = 'asc' } = req.query;

    // Build query
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip(startIndex)
      .populate('createdBy', 'name email');

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate stock for each product
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stockMoves = await StockMove.find({
          product: product._id,
          status: 'done'
        });

        let currentStock = 0;
        stockMoves.forEach(move => {
          if (move.moveType === 'in') {
            currentStock += move.quantity;
          } else if (move.moveType === 'out') {
            currentStock -= move.quantity;
          }
        });

        return {
          ...product.toObject(),
          currentStock,
          stockStatus: currentStock <= product.reorderPoint ? 'low' : 
                      currentStock === 0 ? 'out' : 'available'
        };
      })
    );

    // Pagination info
    const pagination = {
      current: page,
      total: Math.ceil(total / limit),
      count: products.length,
      totalItems: total
    };

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: productsWithStock
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving products'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Calculate stock
    const stockMoves = await StockMove.find({
      product: product._id,
      status: 'done'
    }).populate('sourceLocation destinationLocation', 'name shortCode');

    let currentStock = 0;
    const stockHistory = [];

    stockMoves.forEach(move => {
      if (move.moveType === 'in') {
        currentStock += move.quantity;
      } else if (move.moveType === 'out') {
        currentStock -= move.quantity;
      }
      
      stockHistory.push({
        date: move.completedDate || move.createdAt,
        type: move.moveType,
        quantity: move.quantity,
        reference: move.reference,
        location: move.moveType === 'in' ? move.destinationLocation : move.sourceLocation
      });
    });

    const productWithStock = {
      ...product.toObject(),
      currentStock,
      stockStatus: currentStock <= product.reorderPoint ? 'low' : 
                  currentStock === 0 ? 'out' : 'available',
      stockHistory: stockHistory.slice(-10) // Last 10 movements
    };

    res.status(200).json({
      success: true,
      data: productWithStock
    });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error retrieving product'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Manager/Admin)
router.post('/', auth, authorize('admin', 'manager'), [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name cannot exceed 200 characters'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ max: 50 })
    .withMessage('SKU cannot exceed 50 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('SKU can only contain uppercase letters, numbers, hyphens, and underscores'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('unitOfMeasure')
    .isIn(['pieces', 'kg', 'liters', 'meters', 'boxes', 'tons'])
    .withMessage('Invalid unit of measure'),
  body('costPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost price must be a positive number'),
  body('sellingPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Selling price must be a positive number'),
  body('minStockLevel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stock level must be a non-negative integer'),
  body('maxStockLevel')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum stock level must be a positive integer'),
  body('reorderPoint')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reorder point must be a non-negative integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ 
      sku: req.body.sku.toUpperCase() 
    });
    
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    const product = await Product.create({
      ...req.body,
      sku: req.body.sku.toUpperCase(),
      createdBy: req.user.id
    });

    await product.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Manager/Admin)
router.put('/:id', auth, authorize('admin', 'manager'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),
  body('sku')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU must be between 1 and 50 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('SKU can only contain uppercase letters, numbers, hyphens, and underscores'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('unitOfMeasure')
    .optional()
    .isIn(['pieces', 'kg', 'liters', 'meters', 'boxes', 'tons'])
    .withMessage('Invalid unit of measure'),
  body('costPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost price must be a positive number'),
  body('sellingPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Selling price must be a positive number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If updating SKU, check for duplicates
    if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
      const existingProduct = await Product.findOne({ 
        sku: req.body.sku.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
      }
    }

    // Update fields
    if (req.body.sku) req.body.sku = req.body.sku.toUpperCase();
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating product'
    });
  }
});

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product has stock movements
    const hasStockMovements = await StockMove.findOne({ product: req.params.id });
    
    if (hasStockMovements) {
      // Soft delete - deactivate instead of removing
      product.isActive = false;
      await product.save();
      
      return res.status(200).json({
        success: true,
        message: 'Product deactivated successfully (has stock history)'
      });
    }

    // If no stock movements, can be safely deleted
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error deleting product'
    });
  }
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Private
router.get('/meta/categories', auth, async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    res.status(200).json({
      success: true,
      data: categories.sort()
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving categories'
    });
  }
});

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private
router.get('/reports/low-stock', auth, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('createdBy', 'name email');

    const lowStockProducts = [];

    for (const product of products) {
      const stockMoves = await StockMove.find({
        product: product._id,
        status: 'done'
      });

      let currentStock = 0;
      stockMoves.forEach(move => {
        if (move.moveType === 'in') {
          currentStock += move.quantity;
        } else if (move.moveType === 'out') {
          currentStock -= move.quantity;
        }
      });

      if (currentStock <= product.reorderPoint) {
        lowStockProducts.push({
          ...product.toObject(),
          currentStock,
          stockStatus: currentStock === 0 ? 'out' : 'low'
        });
      }
    }

    res.status(200).json({
      success: true,
      count: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving low stock products'
    });
  }
});

module.exports = router;