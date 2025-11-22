const express = require('express');
const { body, validationResult } = require('express-validator');
const Receipt = require('../models/Receipt');
const StockMove = require('../models/StockMove');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const { createNotification } = require('../services/notificationService');

const router = express.Router();

// ... (all previous routes unchanged) ...

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

    // Create notification (minimal)
    await createNotification({
      userId: null, // broadcast; replace with specific user id if desired
      type: 'receipt_validated',
      title: `Receipt ${receipt._id} validated`,
      message: `Receipt validated with ${stockMoves.length} stock move(s).`,
      entityRef: { kind: 'Receipt', id: receipt._id },
      level: 'info'
    });

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