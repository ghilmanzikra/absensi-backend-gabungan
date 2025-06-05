// routes/kelas.js
const express = require('express');
const router = express.Router();
const kelasController = require('../controllers/kelasController');
const { authenticateGuru, authenticateJWT } = require('../middleware/authMiddleware');

// Get all kelas (requires authentication)
router.get('/all', authenticateJWT, (req, res, next) => {
  console.log('[ROUTE] GET /api/kelas/all triggered');
  next();
}, kelasController.getAllKelas);

// Get kelas by guru ID (requires authentication)
router.get('/', authenticateJWT, (req, res, next) => {
  console.log('[ROUTE] GET /api/kelas triggered');
  next();
}, kelasController.getKelasByGuru);

// Get kelas by ID with details (requires authentication)
router.get('/:id', authenticateJWT, (req, res, next) => {
  console.log('[ROUTE] GET /api/kelas/:id triggered');
  next();
}, kelasController.getKelasById);

// Create new kelas (requires guru authentication)
router.post('/', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] POST /api/kelas triggered');
  next();
}, kelasController.createKelas);

// Update kelas (requires guru authentication)
router.put('/:id', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] PUT /api/kelas/:id triggered');
  next();
}, kelasController.updateKelas);

// Delete kelas (requires guru authentication)
router.delete('/:id', authenticateGuru, (req, res, next) => {
  console.log('[ROUTE] DELETE /api/kelas/:id triggered');
  next();
}, kelasController.deleteKelas);

// Test route
router.get('/test-connection', authenticateJWT, (req, res) => {
  console.log('[ROUTE] GET /api/kelas/test-connection triggered');
  res.json({
    message: 'Kelas routes working!',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
