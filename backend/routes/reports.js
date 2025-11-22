const express = require('express');
const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const StockMove = require('../models/StockMove');
const { auth } = require('../middleware/auth');
const { calculateCurrentStock, getStockMovesHistory } = require('../services/stockCalculationService');

const router = express.Router();

// Helper function to calculate current stock
const getCurrentStock = async (productId) => {
  return await calculateCurrentStock(productId);
};

// @desc    Get product inventory report
// @route   GET /api/reports/products
// @access  Private
router.get('/products', auth, async (req, res) => {
  try {
    const { includeInactive = false, category = '', warehouse = '' } = req.query;

    let query = {};
    if (!includeInactive) {
      query.isActive = true;
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ name: 1 });

    const productReport = [];
    for (const product of products) {
      const currentStock = await getCurrentStock(product._id);
      const stockMoves = await StockMove.find({
        product: product._id,
        status: 'done'
      });

      const totalInQuantity = stockMoves
        .filter(m => m.moveType === 'in')
        .reduce((sum, m) => sum + m.quantity, 0);

      const totalOutQuantity = stockMoves
        .filter(m => m.moveType === 'out')
        .reduce((sum, m) => sum + m.quantity, 0);

      const stockValue = currentStock * (product.costPrice || 0);

      productReport.push({
        sku: product.sku,
        name: product.name,
        category: product.category?.name || 'N/A',
        costPrice: product.costPrice || 0,
        sellingPrice: product.sellingPrice || 0,
        currentStock,
        minStockLevel: product.minStockLevel || 0,
        maxStockLevel: product.maxStockLevel || 0,
        reorderPoint: product.reorderPoint || 0,
        totalInQuantity,
        totalOutQuantity,
        stockValue: stockValue.toFixed(2),
        status: currentStock === 0 ? 'Out of Stock' : 
                currentStock <= product.reorderPoint ? 'Low Stock' : 'In Stock',
        barcode: product.barcode || 'N/A',
        lastUpdated: product.updatedAt
      });
    }

    res.status(200).json({
      success: true,
      count: productReport.length,
      data: productReport
    });
  } catch (error) {
    console.error('Get product report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving product report'
    });
  }
});

// @desc    Get delivery report
// @route   GET /api/reports/deliveries
// @access  Private
router.get('/deliveries', auth, async (req, res) => {
  try {
    const { startDate, endDate, status = '', warehouse = '' } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (warehouse) {
      query.warehouse = warehouse;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const deliveries = await Delivery.find(query)
      .populate('warehouse', 'name')
      .populate('customer', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    const deliveryReport = [];
    let totalValue = 0;
    let totalQuantity = 0;

    for (const delivery of deliveries) {
      const deliveryValue = delivery.items?.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity || 0);
      }, 0) || 0;

      const deliveryQty = delivery.items?.reduce((sum, item) => {
        return sum + (item.quantity || 0);
      }, 0) || 0;

      totalValue += deliveryValue;
      totalQuantity += deliveryQty;

      deliveryReport.push({
        deliveryNumber: delivery.reference,
        customer: delivery.customer?.name || 'N/A',
        warehouse: delivery.warehouse?.name || 'N/A',
        status: delivery.status,
        items: deliveryQty,
        value: deliveryValue.toFixed(2),
        scheduledDate: delivery.scheduledDate,
        actualDate: delivery.actualDeliveryDate || 'N/A',
        notes: delivery.notes || '',
        createdBy: delivery.createdBy?.name || 'N/A',
        createdAt: delivery.createdAt
      });
    }

    res.status(200).json({
      success: true,
      count: deliveryReport.length,
      summary: {
        totalDeliveries: deliveryReport.length,
        totalItems: totalQuantity,
        totalValue: totalValue.toFixed(2)
      },
      data: deliveryReport
    });
  } catch (error) {
    console.error('Get delivery report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving delivery report'
    });
  }
});

// @desc    Get receipt report
// @route   GET /api/reports/receipts
// @access  Private
router.get('/receipts', auth, async (req, res) => {
  try {
    const { startDate, endDate, status = '', supplier = '' } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (supplier) {
      query.supplier = supplier;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const receipts = await Receipt.find(query)
      .populate('warehouse', 'name')
      .populate('supplier', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    const receiptReport = [];
    let totalValue = 0;
    let totalQuantity = 0;

    for (const receipt of receipts) {
      const receiptValue = receipt.items?.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity || 0);
      }, 0) || 0;

      const receiptQty = receipt.items?.reduce((sum, item) => {
        return sum + (item.quantity || 0);
      }, 0) || 0;

      totalValue += receiptValue;
      totalQuantity += receiptQty;

      receiptReport.push({
        receiptNumber: receipt.reference,
        supplier: receipt.supplier?.name || 'N/A',
        warehouse: receipt.warehouse?.name || 'N/A',
        status: receipt.status,
        items: receiptQty,
        value: receiptValue.toFixed(2),
        expectedDate: receipt.expectedDate,
        actualDate: receipt.actualReceiptDate || 'N/A',
        notes: receipt.notes || '',
        createdBy: receipt.createdBy?.name || 'N/A',
        createdAt: receipt.createdAt
      });
    }

    res.status(200).json({
      success: true,
      count: receiptReport.length,
      summary: {
        totalReceipts: receiptReport.length,
        totalItems: totalQuantity,
        totalValue: totalValue.toFixed(2)
      },
      data: receiptReport
    });
  } catch (error) {
    console.error('Get receipt report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving receipt report'
    });
  }
});

// @desc    Get transfer report
// @route   GET /api/reports/transfers
// @access  Private
router.get('/transfers', auth, async (req, res) => {
  try {
    const { startDate, endDate, status = '' } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const transfers = await Transfer.find(query)
      .populate('sourceLocation', 'name')
      .populate('destinationLocation', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    const transferReport = [];
    let totalQuantity = 0;

    for (const transfer of transfers) {
      const transferQty = transfer.items?.reduce((sum, item) => {
        return sum + (item.quantity || 0);
      }, 0) || 0;

      totalQuantity += transferQty;

      transferReport.push({
        transferNumber: transfer.reference,
        from: transfer.sourceLocation?.name || 'N/A',
        to: transfer.destinationLocation?.name || 'N/A',
        status: transfer.status,
        items: transferQty,
        reason: transfer.reason || 'N/A',
        notes: transfer.notes || '',
        createdBy: transfer.createdBy?.name || 'N/A',
        createdAt: transfer.createdAt
      });
    }

    res.status(200).json({
      success: true,
      count: transferReport.length,
      summary: {
        totalTransfers: transferReport.length,
        totalItems: totalQuantity
      },
      data: transferReport
    });
  } catch (error) {
    console.error('Get transfer report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving transfer report'
    });
  }
});

// @desc    Get stock movement report
// @route   GET /api/reports/stock-movement
// @access  Private
router.get('/stock-movement', auth, async (req, res) => {
  try {
    const { startDate, endDate, product = '', moveType = '' } = req.query;

    let query = { status: 'done' };
    if (product) {
      query.product = product;
    }
    if (moveType) {
      query.moveType = moveType;
    }
    if (startDate || endDate) {
      query.completedDate = {};
      if (startDate) {
        query.completedDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.completedDate.$lte = new Date(endDate);
      }
    }

    const moves = await StockMove.find(query)
      .populate('product', 'name sku')
      .populate('sourceLocation destinationLocation', 'name')
      .populate('createdBy', 'name')
      .sort({ completedDate: -1 });

    const movementReport = [];
    let totalInQty = 0;
    let totalOutQty = 0;

    for (const move of moves) {
      if (move.moveType === 'in') {
        totalInQty += move.quantity;
      } else {
        totalOutQty += move.quantity;
      }

      movementReport.push({
        product: move.product?.name || 'N/A',
        sku: move.product?.sku || 'N/A',
        type: move.moveType === 'in' ? 'Inbound' : 'Outbound',
        quantity: move.quantity,
        from: move.sourceLocation?.name || 'Internal',
        to: move.destinationLocation?.name || 'Internal',
        reference: move.reference || 'N/A',
        completedDate: move.completedDate || move.createdAt,
        createdBy: move.createdBy?.name || 'N/A'
      });
    }

    res.status(200).json({
      success: true,
      count: movementReport.length,
      summary: {
        totalMovements: movementReport.length,
        inboundQuantity: totalInQty,
        outboundQuantity: totalOutQty,
        netMovement: totalInQty - totalOutQty
      },
      data: movementReport
    });
  } catch (error) {
    console.error('Get stock movement report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving stock movement report'
    });
  }
});

// @desc    Get warehouse summary report
// @route   GET /api/reports/warehouse-summary
// @access  Private
router.get('/warehouse-summary', auth, async (req, res) => {
  try {
    // This endpoint returns a summary of all warehouses
    const products = await Product.find({ isActive: true });
    const summary = {
      totalProducts: products.length,
      totalStockValue: 0,
      lowStockItems: 0,
      outOfStockItems: 0
    };

    for (const product of products) {
      const currentStock = await getCurrentStock(product._id);
      const stockValue = currentStock * (product.costPrice || 0);
      
      summary.totalStockValue += stockValue;

      if (currentStock === 0) {
        summary.outOfStockItems++;
      } else if (currentStock <= product.reorderPoint) {
        summary.lowStockItems++;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...summary,
        totalStockValue: summary.totalStockValue.toFixed(2),
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get warehouse summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving warehouse summary'
    });
  }
});

module.exports = router;
