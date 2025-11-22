const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { createNotification } = require('../services/notificationService');
// If your project has auth middleware, require and use it here:
// const auth = require('../middleware/auth');

router.get('/', /*auth,*/ async (req, res) => {
  try {
    // use req.user.id if auth is in place; otherwise return all for simplicity
    const userId = req.user ? req.user.id : null;
    const filter = userId ? { $or: [{ userId }, { userId: null }] } : {};
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/unread-count', /*auth,*/ async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const filter = userId ? { userId, read: false } : { read: false };
    const count = await Notification.countDocuments(filter);
    res.json({ unread: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/read', /*auth,*/ async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { read: true, readAt: new Date() }, { new: true });
    res.json(n);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// internal-create endpoint (optional; protect in production)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const n = await createNotification(data);
    res.status(201).json(n);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;