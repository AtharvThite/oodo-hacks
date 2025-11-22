const StockMove = require('../models/StockMove');

/**
 * Calculate current stock for a product
 * Formula: Inbound Quantity - Outbound Quantity
 * 
 * Stock moves that count:
 * - moveType 'in' = inbound (receipt, adjustment +ve)
 * - moveType 'out' = outbound (delivery, adjustment -ve)  
 * - moveType 'internal' = transfers between locations (doesn't affect total)
 * - moveType 'adjustment' = correction (+/- based on quantity sign)
 */
const calculateCurrentStock = async (productId) => {
  try {
    const stockMoves = await StockMove.find({
      product: productId,
      status: 'done'
    });

    let currentStock = 0;

    stockMoves.forEach(move => {
      if (move.moveType === 'in') {
        // Inbound: add to stock
        currentStock += move.quantity;
      } else if (move.moveType === 'out') {
        // Outbound: subtract from stock
        currentStock -= move.quantity;
      } else if (move.moveType === 'adjustment') {
        // Adjustment: quantity can be positive or negative
        currentStock += move.quantity; // Could be negative if it's a reduction
      }
      // Internal transfers don't affect total stock, only location
    });

    // Stock cannot be negative
    return Math.max(0, currentStock);
  } catch (error) {
    console.error(`Error calculating stock for product ${productId}:`, error);
    return 0;
  }
};

/**
 * Calculate current stock by location
 * For warehouse-level inventory tracking
 */
const calculateStockByLocation = async (productId, locationId) => {
  try {
    const inboundMoves = await StockMove.find({
      product: productId,
      destinationLocation: locationId,
      moveType: { $in: ['in', 'internal'] },
      status: 'done'
    });

    const outboundMoves = await StockMove.find({
      product: productId,
      sourceLocation: locationId,
      moveType: { $in: ['out', 'internal'] },
      status: 'done'
    });

    let stock = 0;

    inboundMoves.forEach(move => {
      stock += move.quantity;
    });

    outboundMoves.forEach(move => {
      stock -= move.quantity;
    });

    return Math.max(0, stock);
  } catch (error) {
    console.error(
      `Error calculating stock for product ${productId} at location ${locationId}:`,
      error
    );
    return 0;
  }
};

/**
 * Get all stock moves for a product (for audit trail)
 */
const getStockMovesHistory = async (productId, filters = {}) => {
  try {
    const query = {
      product: productId,
      status: 'done'
    };

    if (filters.startDate || filters.endDate) {
      query.completedDate = {};
      if (filters.startDate) {
        query.completedDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.completedDate.$lte = new Date(filters.endDate);
      }
    }

    if (filters.moveType) {
      query.moveType = filters.moveType;
    }

    const moves = await StockMove.find(query)
      .populate('sourceLocation', 'name code')
      .populate('destinationLocation', 'name code')
      .populate('createdBy', 'name email')
      .sort({ completedDate: -1, createdAt: -1 });

    return moves;
  } catch (error) {
    console.error(`Error fetching stock moves for product ${productId}:`, error);
    return [];
  }
};

/**
 * Validate stock availability
 * Check if enough stock exists for an operation
 */
const validateStockAvailability = async (productId, requiredQuantity, sourceLocationId = null) => {
  try {
    const availableStock = sourceLocationId
      ? await calculateStockByLocation(productId, sourceLocationId)
      : await calculateCurrentStock(productId);

    return {
      hasStock: availableStock >= requiredQuantity,
      availableStock,
      requiredQuantity,
      shortage: Math.max(0, requiredQuantity - availableStock)
    };
  } catch (error) {
    console.error(`Error validating stock for product ${productId}:`, error);
    return {
      hasStock: false,
      availableStock: 0,
      requiredQuantity,
      shortage: requiredQuantity
    };
  }
};

module.exports = {
  calculateCurrentStock,
  calculateStockByLocation,
  getStockMovesHistory,
  validateStockAvailability
};
