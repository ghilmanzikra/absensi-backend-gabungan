// models/Kelas.js
const db = require('../config/db');

const Kelas = {
  // Get all kelas
  getAll: (callback) => {
    const query = `
      SELECT 
        kelas.id_kelas,
        kelas.nama_kelas,
        kelas.guru_id,
        guru.nama AS nama_guru
      FROM kelas
      LEFT JOIN guru ON kelas.guru_id = guru.id
      ORDER BY kelas.nama_kelas ASC
    `;
    db.query(query, callback);
  },

  // Get kelas by guru ID
  getByGuru: (guru_id, callback) => {
    const query = `
      SELECT 
        id_kelas, 
        nama_kelas 
      FROM kelas 
      WHERE guru_id = ?
      ORDER BY nama_kelas ASC
    `;
    db.query(query, [guru_id], callback);
  },

  // Get kelas by ID
  getById: (id_kelas, callback) => {
    const query = `
      SELECT 
        kelas.id_kelas,
        kelas.nama_kelas,
        kelas.guru_id,
        guru.nama AS nama_guru
      FROM kelas
      LEFT JOIN guru ON kelas.guru_id = guru.id
      WHERE kelas.id_kelas = ?
    `;
    db.query(query, [id_kelas], callback);
  },

  // Get kelas with siswa count
  getWithSiswaCount: (callback) => {
    const query = `
      SELECT 
        kelas.id_kelas,
        kelas.nama_kelas,
        kelas.guru_id,
        guru.nama AS nama_guru,
        COUNT(siswa.id) AS jumlah_siswa
      FROM kelas
      LEFT JOIN guru ON kelas.guru_id = guru.id
      LEFT JOIN siswa ON kelas.id_kelas = siswa.id_kelas
      GROUP BY kelas.id_kelas, kelas.nama_kelas, kelas.guru_id, guru.nama
      ORDER BY kelas.nama_kelas ASC
    `;
    db.query(query, callback);
  },

  // Create new kelas
  create: (kelasData, callback) => {
    const { nama_kelas, guru_id } = kelasData;
    const query = `
      INSERT INTO kelas (nama_kelas, guru_id) 
      VALUES (?, ?)
    `;
    db.query(query, [nama_kelas, guru_id], callback);
  },

  // Update kelas
  update: (id_kelas, kelasData, callback) => {
    const { nama_kelas, guru_id } = kelasData;
    const query = `
      UPDATE kelas 
      SET nama_kelas = ?, guru_id = ?
      WHERE id_kelas = ?
    `;
    db.query(query, [nama_kelas, guru_id, id_kelas], callback);
  },

  // Delete kelas
  delete: (id_kelas, callback) => {
    const query = 'DELETE FROM kelas WHERE id_kelas = ?';
    db.query(query, [id_kelas], callback);
  },

  // Get siswa in kelas
  getSiswaInKelas: (id_kelas, callback) => {
    const query = `
      SELECT 
        siswa.id,
        siswa.nama,
        siswa.nis,
        siswa.jenis_kelamin,
        siswa.username
      FROM siswa
      WHERE siswa.id_kelas = ?
      ORDER BY siswa.nama ASC
    `;
    db.query(query, [id_kelas], callback);
  }
};

module.exports = Kelas;
