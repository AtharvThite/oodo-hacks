const express = require('express');
const { body, validationResult } = require('express-validator');
const Transfer = require('../models/Transfer');
const StockMove = require('../models/StockMove');
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
      .populate('sourceLocation destinationLocation', 'name shortCode warehouse')
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
    .isMongoId()
    .withMessage('Valid source location ID is required'),
  body('destinationLocation')
    .isMongoId()
    .withMessage('Valid destination location ID is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.product')
    .isMongoId()
    .withMessage('Valid product ID is required'),
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

    const transfer = await Transfer.create({
      ...req.body,
      createdBy: req.user.id
    });

    await transfer.populate('sourceLocation destinationLocation products.product createdBy');

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

module.exports = router;