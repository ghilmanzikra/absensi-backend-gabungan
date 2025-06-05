// app.js - Unified Backend for Student Attendance System
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth');
const siswaRoutes = require('./routes/siswa');
const guruRoutes = require('./routes/guru');
const absenRoutes = require('./routes/absen');
const kelasRoutes = require('./routes/kelas');

// Import middleware
const { authenticateJWT } = require('./middleware/authMiddleware');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // HTTP request logger

// Custom request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  console.log('[INFO] Root route accessed');
  res.json({
    message: 'Unified Backend Server is running! 🚀',
    version: '1.0.0',
    description: 'Student Attendance System - Unified Backend for Siswa & Guru',
    endpoints: {
      auth: '/api/auth',
      siswa: '/api/siswa',
      guru: '/api/guru',
      absen: '/api/absen',
      kelas: '/api/kelas'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', (req, res, next) => {
  console.log('[ROUTE] Routing to /api/auth');
  next();
}, authRoutes);

app.use('/api/siswa', (req, res, next) => {
  console.log('[ROUTE] Routing to /api/siswa');
  next();
}, siswaRoutes);

app.use('/api/guru', (req, res, next) => {
  console.log('[ROUTE] Routing to /api/guru');
  next();
}, guruRoutes);

app.use('/api/absen', (req, res, next) => {
  console.log('[ROUTE] Routing to /api/absen');
  next();
}, absenRoutes);

app.use('/api/kelas', (req, res, next) => {
  console.log('[ROUTE] Routing to /api/kelas');
  next();
}, kelasRoutes);

// Legacy routes for backward compatibility
app.use('/api/profile', authenticateJWT, (req, res, next) => {
  console.log('[LEGACY] Routing /api/profile to appropriate handler');
  
  if (req.user.role === 'guru') {
    // Redirect to guru profile
    req.url = '/profile';
    guruRoutes(req, res, next);
  } else if (req.user.role === 'siswa') {
    // Redirect to siswa profile
    req.url = '/profile';
    siswaRoutes(req, res, next);
  } else {
    res.status(400).json({ message: 'Invalid user role' });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    available_endpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'GET /api/siswa/profile',
      'GET /api/guru/profile',
      'GET /api/absen',
      'GET /api/kelas'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Log environment variables (for debugging)
console.log('🔧 Environment Configuration:');
console.log('- PORT:', PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('- DB_NAME:', process.env.DB_NAME || 'absensi_app');
console.log('- JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY ? '***SET***' : 'NOT SET (using default)');

// Start server
app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`🚀 Unified Backend Server Started!`);
  console.log(`🚀 Running on: http://localhost:${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Timestamp: ${new Date().toISOString()}`);
  console.log('🚀 ========================================');
});

module.exports = app;
