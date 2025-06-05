// models/Absen.js
const db = require('../config/db');

const Absen = {
  // Insert multiple rows of absen (untuk submit absensi)
  insert: (data, callback) => {
    const query = `
      INSERT INTO absen (id_siswa, id_kelas, tanggal, status, guru_id)
      VALUES ?
    `;
    db.query(query, [data], callback);
  },

  // Insert single absen record
  insertSingle: (absenData, callback) => {
    const { id_siswa, id_kelas, tanggal, status, guru_id } = absenData;
    const query = `
      INSERT INTO absen (id_siswa, id_kelas, tanggal, status, guru_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [id_siswa, id_kelas, tanggal, status, guru_id], callback);
  },

  // Get absen data by class and date with detailed info
  getByKelasAndTanggal: (id_kelas, tanggal, callback) => {
    const query = `
      SELECT 
        absen.id,
        absen.id_siswa,
        siswa.nama AS nama_siswa,
        siswa.nis,
        siswa.jenis_kelamin,
        absen.tanggal,
        absen.status,
        kelas.nama_kelas,
        guru.nama AS nama_guru
      FROM absen
      JOIN siswa ON absen.id_siswa = siswa.id
      JOIN kelas ON absen.id_kelas = kelas.id_kelas
      JOIN guru ON absen.guru_id = guru.id
      WHERE absen.id_kelas = ? AND absen.tanggal = ?
      ORDER BY siswa.nama ASC
    `;
    db.query(query, [id_kelas, tanggal], callback);
  },

  // Get absen history by siswa
  getBySiswa: (id_siswa, callback) => {
    const query = `
      SELECT 
        absen.id,
        absen.tanggal,
        absen.status,
        kelas.nama_kelas,
        guru.nama AS nama_guru
      FROM absen
      JOIN kelas ON absen.id_kelas = kelas.id_kelas
      JOIN guru ON absen.guru_id = guru.id
      WHERE absen.id_siswa = ?
      ORDER BY absen.tanggal DESC
    `;
    db.query(query, [id_siswa], callback);
  },

  // Get absen statistics by kelas
  getStatsByKelas: (id_kelas, callback) => {
    const query = `
      SELECT 
        absen.status,
        COUNT(*) as jumlah
      FROM absen
      JOIN kelas ON absen.id_kelas = kelas.id_kelas
      WHERE absen.id_kelas = ?
      GROUP BY absen.status
    `;
    db.query(query, [id_kelas], callback);
  },

  // Update absen status
  updateStatus: (id, status, callback) => {
    const query = 'UPDATE absen SET status = ? WHERE id = ?';
    db.query(query, [status, id], callback);
  },

  // Delete absen record
  delete: (id, callback) => {
    const query = 'DELETE FROM absen WHERE id = ?';
    db.query(query, [id], callback);
  },

  // Check if absen already exists for siswa on specific date
  checkExisting: (id_siswa, id_kelas, tanggal, callback) => {
    const query = `
      SELECT id FROM absen 
      WHERE id_siswa = ? AND id_kelas = ? AND tanggal = ?
      LIMIT 1
    `;
    db.query(query, [id_siswa, id_kelas, tanggal], callback);
  }
};

module.exports = Absen;
