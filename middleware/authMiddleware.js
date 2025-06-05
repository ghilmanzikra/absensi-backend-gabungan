// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(403).json({ message: 'Token required' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'Token format invalid' });
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'default_jwt_secret_key';
    console.log('🔑 Using JWT secret for verification');

    const decoded = jwt.verify(token, secretKey);
    console.log('✅ JWT decoded successfully:', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ JWT verification error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware khusus untuk siswa
const authenticateSiswa = (req, res, next) => {
  authenticateJWT(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.role !== 'siswa') {
      return res.status(403).json({ message: 'Access denied. Siswa role required.' });
    }
    
    next();
  });
};

// Middleware khusus untuk guru
const authenticateGuru = (req, res, next) => {
  authenticateJWT(req, res, (err) => {
    if (err) return next(err);
    
    if (req.user.role !== 'guru') {
      return res.status(403).json({ message: 'Access denied. Guru role required.' });
    }
    
    next();
  });
};

module.exports = { 
  authenticateJWT, 
  authenticateSiswa, 
  authenticateGuru 
};
