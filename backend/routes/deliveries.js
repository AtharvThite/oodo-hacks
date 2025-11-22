const express = require('express');
const { body, validationResult } = require('express-validator');
const Delivery = require('../models/Delivery');
const StockMove = require('../models/StockMove');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const startIndex = (page - 1) * limit;

    const deliveries = await Delivery.find(query)
      .populate('warehouse sourceLocation', 'name shortCode')
      .populate('products.product', 'name sku')
      .populate('createdBy responsible', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(startIndex);

    const total = await Delivery.countDocuments(query);

    res.status(200).json({
      success: true,
      count: deliveries.length,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      },
      data: deliveries
    });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving deliveries'
    });
  }
});

// @desc    Create new delivery
// @route   POST /api/deliveries
// @access  Private
router.post('/', auth, [
  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('warehouse')
    .isMongoId()
    .withMessage('Valid warehouse ID is required'),
  body('sourceLocation')
    .isMongoId()
    .withMessage('Valid source location ID is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.product')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('products.*.requestedQuantity')
    .isFloat({ gt: 0 })
    .withMessage('Requested quantity must be greater than 0')
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

    const delivery = await Delivery.create({
      ...req.body,
      createdBy: req.user.id
    });

    await delivery.populate('warehouse sourceLocation products.product createdBy');

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: delivery
    });
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating delivery'
    });
  }
});

// @desc    Validate delivery
// @route   PUT /api/deliveries/:id/validate
// @access  Private (Manager/Admin)
router.put('/:id/validate', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    if (delivery.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Delivery must be in ready status to validate'
      });
    }

    // Create stock moves for delivered quantities
    const stockMoves = [];
    for (const item of delivery.products) {
      if (item.deliveredQuantity > 0) {
        const stockMove = await StockMove.create({
          reference: `${delivery.reference}-${item.product}`,
          product: item.product,
          sourceLocation: delivery.sourceLocation,
          quantity: item.deliveredQuantity,
          unitPrice: item.unitPrice || 0,
          moveType: 'out',
          status: 'done',
          scheduledDate: delivery.scheduledDate,
          completedDate: new Date(),
          parentDocument: {
            documentType: 'delivery',
            documentId: delivery._id
          },
          createdBy: req.user.id
        });
        stockMoves.push(stockMove);
      }
    }

    // Update delivery status
    delivery.status = 'done';
    delivery.deliveredDate = new Date();
    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Delivery validated successfully',
      data: delivery,
      stockMoves: stockMoves.length
    });
  } catch (error) {
    console.error('Validate delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error validating delivery'
    });
  }
});

module.exports = router;