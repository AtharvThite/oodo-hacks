const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../utils/sendEmail');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Manager)
router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (role) {
      query.role = role;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const startIndex = (page - 1) * limit;

    const users = await User.find(query)
      .populate('createdBy', 'name email')
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(startIndex);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalItems: total
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin)
router.post('/', auth, authorize('admin'), [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .isIn(['admin', 'manager', 'staff'])
    .withMessage('Role must be admin, manager, or staff')
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

    const { name, email, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: tempPassword,
      role,
      createdBy: req.user.id
    });

    // Send welcome email with temporary password
    await sendWelcomeEmail(email, name, tempPassword);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User created successfully. Welcome email sent.',
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating user'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
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

    const { name, email } = req.body;
    const updateFields = {};
    
    if (name) updateFields.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
      updateFields.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @desc    Deactivate user
// @route   PUT /api/users/:id/deactivate
// @access  Private (Admin)
router.put('/:id/deactivate', auth, authorize('admin'), async (req, res) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deactivating user'
    });
  }
});

module.exports = router;