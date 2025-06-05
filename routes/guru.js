// routes/guru.js
const express = require('express');
const router = express.Router();
const guruController = require('../controllers/guruController');
const { authenticateGuru, authenticateJWT } = require('../middleware/authMiddleware');

// Get guru profile (requires guru authentication)
router.get('/profile', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] GET /api/guru/profile triggered');
  next();
}, guruController.getProfile);

// Update guru profile (requires guru authentication)
router.put('/profile', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] PUT /api/guru/profile triggered');
  next();
}, guruController.updateProfile);

// Get kelas yang diajar oleh guru (requires guru authentication)
router.get('/kelas', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] GET /api/guru/kelas triggered');
  next();
}, guruController.getKelas);

// Get guru dashboard stats (requires guru authentication)
router.get('/dashboard', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] GET /api/guru/dashboard triggered');
  next();
}, guruController.getDashboardStats);

// Get all guru (for admin use)
router.get('/list', authenticateJWT, (req, res, next) => {
  console.log('[ROUTE] GET /api/guru/list triggered');
  next();
}, guruController.getAllGuru);

// Test route
router.get('/test', authenticateGuru, (req, res) => {
  console.log('[ROUTE] GET /api/guru/test triggered');
  res.json({ 
    message: 'Guru routes working!', 
    user: req.user,
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
