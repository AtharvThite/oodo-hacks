const express = require('express');
const { body, validationResult } = require('express-validator');
const Receipt = require('../models/Receipt');
const StockMove = require('../models/StockMove');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const startIndex = (page - 1) * limit;

    const receipts = await Receipt.find(query)
      .populate('warehouse location', 'name shortCode')
      .populate('products.product', 'name sku')
      .populate('createdBy responsible', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(startIndex);

    const total = await Receipt.countDocuments(query);

    res.status(200).json({
      success: true,
      count: receipts.length,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      },
      data: receipts
    });
  } catch (error) {
    console.error('Get receipts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving receipts'
    });
  }
});

// @desc    Get single receipt
// @route   GET /api/receipts/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('warehouse location', 'name shortCode address')
      .populate('products.product', 'name sku unitOfMeasure')
      .populate('createdBy responsible', 'name email');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving receipt'
    });
  }
});

// @desc    Create new receipt
// @route   POST /api/receipts
// @access  Private
router.post('/', auth, [
  body('supplier.name')
    .trim()
    .notEmpty()
    .withMessage('Supplier name is required'),
  body('warehouse')
    .isMongoId()
    .withMessage('Valid warehouse ID is required'),
  body('location')
    .isMongoId()
    .withMessage('Valid location ID is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.product')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('products.*.expectedQuantity')
    .isFloat({ gt: 0 })
    .withMessage('Expected quantity must be greater than 0')
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

    const receipt = await Receipt.create({
      ...req.body,
      createdBy: req.user.id
    });

    await receipt.populate('warehouse location products.product createdBy');

    res.status(201).json({
      success: true,
      message: 'Receipt created successfully',
      data: receipt
    });
  } catch (error) {
    console.error('Create receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating receipt'
    });
  }
});

// @desc    Validate receipt
// @route   PUT /api/receipts/:id/validate
// @access  Private (Manager/Admin)
router.put('/:id/validate', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    if (receipt.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Receipt must be in ready status to validate'
      });
    }

    // Create stock moves for received quantities
    const stockMoves = [];
    for (const item of receipt.products) {
      if (item.receivedQuantity > 0) {
        const stockMove = await StockMove.create({
          reference: `${receipt.reference}-${item.product}`,
          product: item.product,
          destinationLocation: receipt.location,
          quantity: item.receivedQuantity,
          unitPrice: item.unitPrice || 0,
          moveType: 'in',
          status: 'done',
          scheduledDate: receipt.scheduledDate,
          completedDate: new Date(),
          parentDocument: {
            documentType: 'receipt',
            documentId: receipt._id
          },
          createdBy: req.user.id
        });
        stockMoves.push(stockMove);
      }
    }

    // Update receipt status
    receipt.status = 'done';
    receipt.receivedDate = new Date();
    await receipt.save();

    res.status(200).json({
      success: true,
      message: 'Receipt validated successfully',
      data: receipt,
      stockMoves: stockMoves.length
    });
  } catch (error) {
    console.error('Validate receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error validating receipt'
    });
  }
});

// @desc    Update receipt quantities
// @route   PUT /api/receipts/:id/quantities
// @access  Private
router.put('/:id/quantities', auth, [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products array is required'),
  body('products.*.productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('products.*.receivedQuantity')
    .isFloat({ min: 0 })
    .withMessage('Received quantity must be non-negative')
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

    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    if (receipt.status === 'done' || receipt.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update quantities for completed or cancelled receipts'
      });
    }

    // Update received quantities
    req.body.products.forEach(update => {
      const productIndex = receipt.products.findIndex(
        p => p.product.toString() === update.productId
      );
      if (productIndex !== -1) {
        receipt.products[productIndex].receivedQuantity = update.receivedQuantity;
      }
    });

    // Update status to ready if all quantities are set
    const allReceived = receipt.products.every(p => p.receivedQuantity > 0);
    if (allReceived && receipt.status === 'draft') {
      receipt.status = 'ready';
    }

    await receipt.save();
    await receipt.populate('warehouse location products.product createdBy');

    res.status(200).json({
      success: true,
      message: 'Receipt quantities updated successfully',
      data: receipt
    });
  } catch (error) {
    console.error('Update receipt quantities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating receipt quantities'
    });
  }
});

module.exports = router;