// routes/siswa.js
const express = require('express');
const router = express.Router();
const siswaController = require('../controllers/siswaController');
const { authenticateSiswa, authenticateJWT } = require('../middleware/authMiddleware');

// Get siswa profile (requires siswa authentication)
router.get('/profile', authenticateSiswa, (req, res, next) => {
  console.log('[ROUTE] GET /api/siswa/profile triggered');
  next();
}, siswaController.getProfile);

// Get siswa absensi history (requires siswa authentication)
router.get('/absensi', authenticateSiswa, (req, res, next) => {
  console.log('[ROUTE] GET /api/siswa/absensi triggered');
  next();
}, siswaController.getAbsensi);

// Update siswa profile (requires siswa authentication)
router.put('/profile', authenticateSiswa, (req, res, next) => {
  console.log('[ROUTE] PUT /api/siswa/profile triggered');
  next();
}, siswaController.updateProfile);

// Get all siswa by kelas (for guru/admin use)
router.get('/list', authenticateJWT, (req, res, next) => {
  console.log('[ROUTE] GET /api/siswa/list triggered');
  next();
}, siswaController.getAllSiswa);

// Legacy route for backward compatibility with old absensi-backend
router.post('/login', (req, res) => {
  console.log('[ROUTE] POST /api/siswa/login - redirecting to /api/auth/login');
  res.status(301).json({ 
    message: 'Login endpoint has moved to /api/auth/login',
    redirect: '/api/auth/login'
  });
});

// Test route
router.get('/test', authenticateSiswa, (req, res) => {
  console.log('[ROUTE] GET /api/siswa/test triggered');
  res.json({ 
    message: 'Siswa routes working!', 
    user: req.user,
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
