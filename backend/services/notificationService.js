const Notification = require('../models/Notification');

async function createNotification({ userId = null, type, title, message = '', entityRef = null, level = 'info' }) {
  const n = new Notification({
    userId,
    type,
    title,
    message,
    entityRef,
    level
  });
  return n.save();
}

module.exports = { createNotification };