const express = require('express');
const { body, validationResult } = require('express-validator');
const { Warehouse, Location } = require('../models/Warehouse');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const warehouses = await Warehouse.find()
      .populate('createdBy', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving warehouses'
    });
  }
});

// @desc    Get single warehouse with locations
// @route   GET /api/warehouses/:id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    const locations = await Location.find({ warehouse: req.params.id, isActive: true })
      .populate('createdBy', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...warehouse.toObject(),
        locations
      }
    });
  } catch (error) {
    console.error('Get warehouse error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving warehouse'
    });
  }
});

// @desc    Create new warehouse
// @route   POST /api/warehouses
// @access  Private (All authenticated users)
router.post('/', auth, [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Warehouse name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Warehouse code is required')
    .isLength({ max: 10 })
    .withMessage('Code cannot exceed 10 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('Code can only contain uppercase letters, numbers, hyphens, and underscores')
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

    const warehouse = await Warehouse.create({
      ...req.body,
      code: req.body.code.toUpperCase(),
      createdBy: req.user.id
    });

    await warehouse.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: warehouse
    });
  } catch (error) {
    console.error('Create warehouse error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse with this code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating warehouse'
    });
  }
});

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private (Manager/Admin)
router.put('/:id', auth, authorize('admin', 'manager'), [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Warehouse name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('code')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Warehouse code cannot be empty')
    .isLength({ max: 10 })
    .withMessage('Code cannot exceed 10 characters')
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage('Code can only contain uppercase letters, numbers, hyphens, and underscores')
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

    let warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // Update fields
    const updateData = { ...req.body };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Warehouse updated successfully',
      data: warehouse
    });
  } catch (error) {
    console.error('Update warehouse error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse with this code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating warehouse'
    });
  }
});

// @desc    Delete warehouse (soft delete)
// @route   DELETE /api/warehouses/:id
// @access  Private (Admin)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    // Soft delete
    warehouse.isActive = false;
    await warehouse.save();

    res.status(200).json({
      success: true,
      message: 'Warehouse deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete warehouse error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting warehouse'
    });
  }
});

// @desc    Get all locations
// @route   GET /api/warehouses/locations
// @access  Private
router.get('/locations/all', auth, async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true })
      .populate('warehouse', 'name code')
      .populate('createdBy', 'name email')
      .sort({ 'warehouse.name': 1, name: 1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving locations'
    });
  }
});

// @desc    Create new location
// @route   POST /api/warehouses/:warehouseId/locations
// @access  Private (Manager/Admin)
router.post('/:warehouseId/locations', auth, authorize('admin', 'manager'), [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Location name is required'),
  body('shortCode')
    .trim()
    .notEmpty()
    .withMessage('Short code is required')
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('Short code can only contain uppercase letters, numbers, and hyphens'),
  body('type')
    .optional()
    .isIn(['storage', 'input', 'output', 'internal', 'production'])
    .withMessage('Invalid location type')
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

    // Check if warehouse exists
    const warehouse = await Warehouse.findById(req.params.warehouseId);
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: 'Warehouse not found'
      });
    }

    const location = await Location.create({
      ...req.body,
      shortCode: req.body.shortCode.toUpperCase(),
      warehouse: req.params.warehouseId,
      createdBy: req.user.id
    });

    await location.populate('warehouse createdBy', 'name code');

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: location
    });
  } catch (error) {
    console.error('Create location error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Location with this short code already exists in this warehouse'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating location'
    });
  }
});

module.exports = router;