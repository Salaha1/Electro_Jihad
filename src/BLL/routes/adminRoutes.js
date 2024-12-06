const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../services/middleware/authMiddleware');

// Example route: Admin Dashboard
router.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
});

module.exports = router;