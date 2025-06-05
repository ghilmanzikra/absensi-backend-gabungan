// routes/absen.js
const express = require('express');
const router = express.Router();
const absenController = require('../controllers/absenController');
const { authenticateGuru, authenticateJWT } = require('../middleware/authMiddleware');

// Submit absensi (requires guru authentication)
router.post('/submit', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] POST /api/absen/submit triggered');
  next();
}, absenController.submitAbsen);

// Get absensi by kelas and tanggal (requires authentication)
router.get('/', authenticateJWT, (req, res, next) => {
  console.log('[ROUTE] GET /api/absen triggered');
  next();
}, absenController.getAbsen);

// Get absensi statistics by kelas (requires authentication)
router.get('/stats', authenticateJWT, (req, res, next) => {
  console.log('[ROUTE] GET /api/absen/stats triggered');
  next();
}, absenController.getAbsenStats);

// Update absensi status (requires guru authentication)
router.put('/:id', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] PUT /api/absen/:id triggered');
  next();
}, absenController.updateAbsenStatus);

// Delete absensi record (requires guru authentication)
router.delete('/:id', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] DELETE /api/absen/:id triggered');
  next();
}, absenController.deleteAbsen);

// Test route
router.get('/test', authenticateJWT, (req, res) => {
  console.log('[ROUTE] GET /api/absen/test triggered');
  res.json({ 
    message: 'Absen routes working!', 
    user: req.user,
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
