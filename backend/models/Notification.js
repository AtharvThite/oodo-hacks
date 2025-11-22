const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null => broadcast
  type: { type: String, required: true }, // e.g. 'low_stock','receipt_received'
  title: { type: String, required: true },
  message: { type: String, default: '' },
  entityRef: {
    kind: { type: String }, // 'Product'|'Receipt'|'Delivery'...
    id: { type: mongoose.Schema.Types.ObjectId }
  },
  level: { type: String, enum: ['info','warning','critical'], default: 'info' },
  read: { type: Boolean, default: false },
  readAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);