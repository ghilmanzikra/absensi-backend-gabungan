// models/User.js
const db = require('../config/db');

const User = {
  // Find user by username (untuk login)
  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM user WHERE username = ? LIMIT 1';
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    });
  },

  // Find user by username and role (untuk validasi spesifik)
  findByUsernameAndRole: (username, role, callback) => {
    const sql = 'SELECT * FROM user WHERE username = ? AND role = ? LIMIT 1';
    db.query(sql, [username, role], (err, results) => {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    });
  },

  // Create new user
  create: (userData, callback) => {
    const { username, password, role } = userData;
    const sql = 'INSERT INTO user (username, password, role) VALUES (?, ?, ?)';
    db.query(sql, [username, password, role], callback);
  },

  // Update user password
  updatePassword: (username, newPassword, callback) => {
    const sql = 'UPDATE user SET password = ? WHERE username = ?';
    db.query(sql, [newPassword, username], callback);
  },

  // Get all users by role
  findByRole: (role, callback) => {
    const sql = 'SELECT username, role FROM user WHERE role = ?';
    db.query(sql, [role], callback);
  }
};

module.exports = User;
