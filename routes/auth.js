// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route for both guru and siswa
router.post('/login', (req, res, next) => {
  console.log('[ROUTE] POST /api/auth/login triggered');
  next();
}, authController.login);

// Register route (optional - for admin use)
router.post('/register', (req, res, next) => {
  console.log('[ROUTE] POST /api/auth/register triggered');
  next();
}, authController.register);

// Test route
router.get('/test', (req, res) => {
  console.log('[ROUTE] GET /api/auth/test triggered');
  res.json({ 
    message: 'Auth routes working!', 
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
