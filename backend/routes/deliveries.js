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
    .notEmpty()
    .withMessage('Source location is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.product')
    .notEmpty()
    .withMessage('Product is required'),
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
        requestedQuantity: item.requestedQuantity,
        deliveredQuantity: item.deliveredQuantity || 0,
        unitPrice: item.unitPrice || 0,
        notes: item.notes
      };
    });

    const products = await Promise.all(productPromises);

    const delivery = await Delivery.create({
      ...req.body,
      products,
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

// @desc    Get single delivery
// @route   GET /api/deliveries/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('warehouse sourceLocation', 'name shortCode address')
      .populate('products.product', 'name sku unitOfMeasure')
      .populate('createdBy responsible', 'name email');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving delivery'
    });
  }
});

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Private
router.put('/:id', auth, [
  body('customer.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Customer name cannot be empty'),
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

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    if (delivery.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update delivery that is not in draft status'
      });
    }

    Object.assign(delivery, req.body);
    await delivery.save();
    await delivery.populate('warehouse sourceLocation products.product createdBy');

    res.status(200).json({
      success: true,
      message: 'Delivery updated successfully',
      data: delivery
    });
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating delivery'
    });
  }
});

// @desc    Delete delivery
// @route   DELETE /api/deliveries/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    if (delivery.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete delivery that is not in draft status'
      });
    }

    await Delivery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Delivery deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting delivery'
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

// @desc    Update delivery quantities
// @route   PUT /api/deliveries/:id/quantities
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

    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Update quantities
    delivery.products = products.map(p => ({
      product: p.product,
      quantity: p.quantity,
      delivered: p.delivered || p.quantity
    }));

    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Quantities updated successfully',
      data: delivery
    });
  } catch (error) {
    console.error('Update delivery quantities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating quantities'
    });
  }
});

module.exports = router;