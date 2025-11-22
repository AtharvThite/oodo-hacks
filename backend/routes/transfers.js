const express = require('express');
const { body, validationResult } = require('express-validator');
const Transfer = require('../models/Transfer');
const StockMove = require('../models/StockMove');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const startIndex = (page - 1) * limit;

    const transfers = await Transfer.find(query)
      .populate('products.product', 'name sku')
      .populate('createdBy responsible', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(startIndex);

    const total = await Transfer.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transfers.length,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      },
      data: transfers
    });
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving transfers'
    });
  }
});

// @desc    Create new transfer
// @route   POST /api/transfers
// @access  Private
router.post('/', auth, [
  body('sourceLocation')
    .notEmpty()
    .withMessage('Source location is required'),
  body('destinationLocation')
    .notEmpty()
    .withMessage('Destination location is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.product')
    .notEmpty()
    .withMessage('Product is required'),
  body('products.*.quantity')
    .isFloat({ gt: 0 })
    .withMessage('Quantity must be greater than 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (req.body.sourceLocation === req.body.destinationLocation) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination locations must be different'
      });
    }

    // Convert product SKUs to ObjectIds
    const productPromises = req.body.products.map(async (item) => {
      let productId = item.product;
      
      // Check if it's a MongoDB ObjectId or SKU
      if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        // It's a SKU, find the product
        const product = await Product.findOne({ sku: productId.toUpperCase() });
        if (!product) {
          throw new Error(`Product with SKU ${productId} not found`);
        }
        productId = product._id;
      }
      
      return {
        product: productId,
        quantity: item.quantity,
        transferredQuantity: item.transferredQuantity || 0,
        notes: item.notes
      };
    });

    const products = await Promise.all(productPromises);

    const transfer = await Transfer.create({
      ...req.body,
      products,
      createdBy: req.user.id
    });

    await transfer.populate('products.product createdBy');

    res.status(201).json({
      success: true,
      message: 'Transfer created successfully',
      data: transfer
    });
  } catch (error) {
    console.error('Create transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating transfer'
    });
  }
});

// @desc    Get single transfer
// @route   GET /api/transfers/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate('products.product', 'name sku unitOfMeasure')
      .populate('createdBy responsible', 'name email');

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transfer
    });
  } catch (error) {
    console.error('Get transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving transfer'
    });
  }
});

// @desc    Update transfer
// @route   PUT /api/transfers/:id
// @access  Private
router.put('/:id', auth, [
  body('reference')
    .optional()
    .trim(),
  body('scheduledDate')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    if (transfer.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update transfer that is not in draft status'
      });
    }

    Object.assign(transfer, req.body);
    await transfer.save();
    await transfer.populate('products.product createdBy');

    res.status(200).json({
      success: true,
      message: 'Transfer updated successfully',
      data: transfer
    });
  } catch (error) {
    console.error('Update transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating transfer'
    });
  }
});

// @desc    Delete transfer
// @route   DELETE /api/transfers/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    if (transfer.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete transfer that is not in draft status'
      });
    }

    await Transfer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Transfer deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting transfer'
    });
  }
});

// @desc    Validate transfer
// @route   PUT /api/transfers/:id/validate
// @access  Private (Manager/Admin)
router.put('/:id/validate', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    if (transfer.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Transfer must be in ready status to validate'
      });
    }

    // Create stock moves for transferred quantities
    const stockMoves = [];
    for (const item of transfer.products) {
      if (item.transferredQuantity > 0) {
        const stockMove = await StockMove.create({
          reference: `${transfer.reference}-${item.product}`,
          product: item.product,
          sourceLocation: transfer.sourceLocation,
          destinationLocation: transfer.destinationLocation,
          quantity: item.transferredQuantity,
          moveType: 'internal',
          status: 'done',
          scheduledDate: transfer.scheduledDate,
          completedDate: new Date(),
          parentDocument: {
            documentType: 'transfer',
            documentId: transfer._id
          },
          createdBy: req.user.id
        });
        stockMoves.push(stockMove);
      }
    }

    // Update transfer status
    transfer.status = 'done';
    transfer.completedDate = new Date();
    await transfer.save();

    res.status(200).json({
      success: true,
      message: 'Transfer validated successfully',
      data: transfer,
      stockMoves: stockMoves.length
    });
  } catch (error) {
    console.error('Validate transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error validating transfer'
    });
  }
});

// @desc    Update transfer quantities
// @route   PUT /api/transfers/:id/quantities
// @access  Private
router.put('/:id/quantities', auth, async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }

    // Update quantities
    transfer.products = products.map(p => ({
      product: p.product,
      quantity: p.quantity,
      transferred: p.transferred || p.quantity
    }));

    await transfer.save();

    res.status(200).json({
      success: true,
      message: 'Quantities updated successfully',
      data: transfer
    });
  } catch (error) {
    console.error('Update transfer quantities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating quantities'
    });
  }
});

module.exports = router;