const express = require('express');
const Product = require('../models/Product');
const StockMove = require('../models/StockMove');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard KPIs
// @route   GET /api/dashboard/kpis
// @access  Private
router.get('/kpis', auth, async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Calculate stock levels
    const products = await Product.find({ isActive: true });
    let totalInStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

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

      totalInStock += currentStock;

      if (currentStock === 0) {
        outOfStockCount++;
      } else if (currentStock <= product.reorderPoint) {
        lowStockCount++;
      }
    }

    // Get pending operations
    const pendingReceipts = await Receipt.countDocuments({ 
      status: { $in: ['draft', 'waiting', 'ready'] } 
    });
    
    const pendingDeliveries = await Delivery.countDocuments({ 
      status: { $in: ['draft', 'waiting', 'ready'] } 
    });
    
    const pendingTransfers = await Transfer.countDocuments({ 
      status: { $in: ['draft', 'waiting', 'ready'] } 
    });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentReceipts = await Receipt.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: 'done'
    });
    
    const recentDeliveries = await Delivery.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: 'done'
    });

    res.status(200).json({
      success: true,
      data: {
        inventory: {
          totalProducts,
          totalInStock,
          lowStockCount,
          outOfStockCount
        },
        operations: {
          pendingReceipts,
          pendingDeliveries,
          pendingTransfers
        },
        recentActivity: {
          receiptsLast30Days: recentReceipts,
          deliveriesLast30Days: recentDeliveries
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard KPIs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving dashboard data'
    });
  }
});

// @desc    Get recent operations
// @route   GET /api/dashboard/recent-operations
// @access  Private
router.get('/recent-operations', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent receipts
    const recentReceipts = await Receipt.find()
      .populate('warehouse', 'name shortCode')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('reference supplier status scheduledDate createdAt');

    // Get recent deliveries
    const recentDeliveries = await Delivery.find()
      .populate('warehouse', 'name shortCode')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('reference customer status scheduledDate createdAt');

    // Get recent transfers
    const recentTransfers = await Transfer.find()
      .populate('sourceLocation destinationLocation', 'name shortCode')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('reference status scheduledDate createdAt');

    res.status(200).json({
      success: true,
      data: {
        receipts: recentReceipts,
        deliveries: recentDeliveries,
        transfers: recentTransfers
      }
    });
  } catch (error) {
    console.error('Get recent operations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving recent operations'
    });
  }
});

// @desc    Get stock alerts
// @route   GET /api/dashboard/alerts
// @access  Private
router.get('/alerts', auth, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).select('name sku reorderPoint');
    const alerts = [];

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
        alerts.push({
          type: currentStock === 0 ? 'out_of_stock' : 'low_stock',
          product: {
            id: product._id,
            name: product.name,
            sku: product.sku
          },
          currentStock,
          reorderPoint: product.reorderPoint,
          message: currentStock === 0 
            ? `${product.name} is out of stock`
            : `${product.name} is running low (${currentStock} remaining)`
        });
      }
    }

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Get stock alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving stock alerts'
    });
  }
});

module.exports = router;