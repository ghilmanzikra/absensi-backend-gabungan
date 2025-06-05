// models/Guru.js
const db = require('../config/db');

const Guru = {
  // Get guru profile by ID
  getProfile: (id, callback) => {
    const sql = `
      SELECT 
        id,
        nama,
        nip,
        jenis_kelamin,
        alamat,
        no_hp,
        username
      FROM guru 
      WHERE id = ?
    `;
    db.query(sql, [id], callback);
  },

  // Get guru profile by username
  getProfileByUsername: (username, callback) => {
    const sql = `
      SELECT 
        id,
        nama,
        nip,
        jenis_kelamin,
        alamat,
        no_hp,
        username
      FROM guru 
      WHERE username = ?
    `;
    db.query(sql, [username], callback);
  },

  // Get all guru
  getAll: (callback) => {
    const sql = `
      SELECT 
        id,
        nama,
        nip,
        jenis_kelamin,
        alamat,
        no_hp,
        username
      FROM guru 
      ORDER BY nama ASC
    `;
    db.query(sql, callback);
  },

  // Create new guru
  create: (guruData, callback) => {
    const { id, nama, nip, jenis_kelamin, alamat, no_hp, username } = guruData;
    const sql = `
      INSERT INTO guru (id, nama, nip, jenis_kelamin, alamat, no_hp, username) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [id, nama, nip, jenis_kelamin, alamat, no_hp, username], callback);
  },

  // Update guru profile
  update: (id, guruData, callback) => {
    const { nama, nip, jenis_kelamin, alamat, no_hp } = guruData;
    const sql = `
      UPDATE guru 
      SET nama = ?, nip = ?, jenis_kelamin = ?, alamat = ?, no_hp = ?
      WHERE id = ?
    `;
    db.query(sql, [nama, nip, jenis_kelamin, alamat, no_hp, id], callback);
  },

  // Find guru by NIP
  findByNip: (nip, callback) => {
    const sql = 'SELECT * FROM guru WHERE nip = ? LIMIT 1';
    db.query(sql, [nip], callback);
  }
};

module.exports = Guru;
