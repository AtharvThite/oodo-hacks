const express = require('express');
const { body, validationResult } = require('express-validator');
const Adjustment = require('../models/Adjustment');
const StockMove = require('../models/StockMove');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all adjustments
// @route   GET /api/adjustments
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    if (type) {
      query.adjustmentType = type;
    }

    const startIndex = (page - 1) * limit;

    const adjustments = await Adjustment.find(query)
      .populate('location', 'name shortCode warehouse')
      .populate('products.product', 'name sku')
      .populate('createdBy responsible approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(startIndex);

    const total = await Adjustment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: adjustments.length,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      },
      data: adjustments
    });
  } catch (error) {
    console.error('Get adjustments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving adjustments'
    });
  }
});

// @desc    Create new adjustment
// @route   POST /api/adjustments
// @access  Private (Manager/Admin)
router.post('/', auth, authorize('admin', 'manager'), [
  body('location')
    .isMongoId()
    .withMessage('Valid location ID is required'),
  body('adjustmentType')
    .isIn(['physical_count', 'damage', 'loss', 'found', 'correction'])
    .withMessage('Invalid adjustment type'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Adjustment reason is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.product')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('products.*.theoreticalQuantity')
    .isFloat({ min: 0 })
    .withMessage('Theoretical quantity must be non-negative'),
  body('products.*.actualQuantity')
    .isFloat({ min: 0 })
    .withMessage('Actual quantity must be non-negative')
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

    const adjustment = await Adjustment.create({
      ...req.body,
      createdBy: req.user.id
    });

    await adjustment.populate('location products.product createdBy');

    res.status(201).json({
      success: true,
      message: 'Adjustment created successfully',
      data: adjustment
    });
  } catch (error) {
    console.error('Create adjustment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating adjustment'
    });
  }
});

// @desc    Approve and validate adjustment
// @route   PUT /api/adjustments/:id/approve
// @access  Private (Admin)
router.put('/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    if (adjustment.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Adjustment must be in ready status to approve'
      });
    }

    // Create stock moves for differences
    const stockMoves = [];
    for (const item of adjustment.products) {
      if (item.difference !== 0) {
        const stockMove = await StockMove.create({
          reference: `${adjustment.reference}-${item.product}`,
          product: item.product,
          sourceLocation: item.difference < 0 ? adjustment.location : null,
          destinationLocation: item.difference > 0 ? adjustment.location : null,
          quantity: Math.abs(item.difference),
          moveType: 'adjustment',
          status: 'done',
          scheduledDate: adjustment.adjustmentDate,
          completedDate: new Date(),
          notes: `Adjustment: ${adjustment.reason}`,
          parentDocument: {
            documentType: 'adjustment',
            documentId: adjustment._id
          },
          createdBy: req.user.id
        });
        stockMoves.push(stockMove);
      }
    }

    // Update adjustment status
    adjustment.status = 'done';
    adjustment.approvedBy = req.user.id;
    adjustment.approvedDate = new Date();
    await adjustment.save();

    res.status(200).json({
      success: true,
      message: 'Adjustment approved and validated successfully',
      data: adjustment,
      stockMoves: stockMoves.length
    });
  } catch (error) {
    console.error('Approve adjustment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving adjustment'
    });
  }
});

module.exports = router;