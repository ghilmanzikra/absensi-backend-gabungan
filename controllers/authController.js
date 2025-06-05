// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
  // Login untuk guru dan siswa
  login: (req, res) => {
    const { username, password } = req.body;

    console.log('🔐 Login attempt for:', username);

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    User.findByUsername(username, (err, user) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        console.log('❌ User not found:', username);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('✅ User found:', user.username, 'Role:', user.role);

      // Check if password is hashed (bcrypt) or plain text
      const isHashedPassword = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

      if (isHashedPassword) {
        // Use bcrypt for hashed passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('❌ Bcrypt error:', err);
            return res.status(500).json({ message: 'Server error' });
          }

          if (!isMatch) {
            console.log('❌ Invalid password for:', username);
            return res.status(401).json({ message: 'Invalid password' });
          }

          generateTokenAndRespond(user, res);
        });
      } else {
        // Plain text password comparison (for existing data)
        if (user.password !== password) {
          console.log('❌ Invalid password for:', username);
          return res.status(401).json({ message: 'Invalid password' });
        }

        generateTokenAndRespond(user, res);
      }
    });
  },

  // Register new user (optional - untuk admin)
  register: (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, dan role harus diisi' });
    }

    if (!['guru', 'siswa'].includes(role)) {
      return res.status(400).json({ message: 'Role harus guru atau siswa' });
    }

    // Check if user already exists
    User.findByUsername(username, (err, existingUser) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (existingUser) {
        return res.status(409).json({ message: 'Username sudah digunakan' });
      }

      // Hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('❌ Bcrypt error:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        const userData = {
          username,
          password: hashedPassword,
          role
        };

        User.create(userData, (err, result) => {
          if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ message: 'Gagal membuat user' });
          }

          console.log('✅ User created successfully:', username);
          res.status(201).json({ 
            message: 'User berhasil dibuat',
            user: {
              username,
              role
            }
          });
        });
      });
    });
  }
};

// Helper function to generate token and send response
function generateTokenAndRespond(user, res) {
  const payload = {
    id: user.username, // Keep compatibility with existing code
    username: user.username,
    role: user.role
  };

  const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'default_jwt_secret_key';
  const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });

  console.log('✅ Login successful for:', user.username);

  return res.status(200).json({
    message: 'Login successful',
    token,
    role: user.role,
    user: {
      username: user.username,
      role: user.role
    }
  });
}

module.exports = authController;
