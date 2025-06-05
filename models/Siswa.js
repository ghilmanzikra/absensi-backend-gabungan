// models/Siswa.js
const db = require('../config/db');

const Siswa = {
  // Get siswa profile by ID
  getProfile: (id, callback) => {
    const sql = `
      SELECT 
        siswa.id,
        siswa.nama,
        siswa.nis,
        siswa.jenis_kelamin,
        siswa.alamat,
        siswa.no_hp,
        siswa.username,
        kelas.nama_kelas
      FROM siswa 
      LEFT JOIN kelas ON siswa.id_kelas = kelas.id_kelas
      WHERE siswa.id = ? OR siswa.username = ?
    `;
    db.query(sql, [id, id], callback);
  },

  // Get siswa profile by username
  getProfileByUsername: (username, callback) => {
    const sql = `
      SELECT 
        siswa.id,
        siswa.nama,
        siswa.nis,
        siswa.jenis_kelamin,
        siswa.alamat,
        siswa.no_hp,
        siswa.username,
        siswa.id_kelas,
        kelas.nama_kelas
      FROM siswa 
      LEFT JOIN kelas ON siswa.id_kelas = kelas.id_kelas
      WHERE siswa.username = ?
    `;
    db.query(sql, [username], callback);
  },

  // Get riwayat absensi siswa
  getRiwayatAbsen: (id_siswa, callback) => {
    const sql = `
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
    db.query(sql, [id_siswa], callback);
  },

  // Get all siswa by kelas
  getByKelas: (id_kelas, callback) => {
    const sql = `
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
    db.query(sql, [id_kelas], callback);
  },

  // Create new siswa
  create: (siswaData, callback) => {
    const { id, nama, nis, jenis_kelamin, alamat, no_hp, id_kelas, username } = siswaData;
    const sql = `
      INSERT INTO siswa (id, nama, nis, jenis_kelamin, alamat, no_hp, id_kelas, username) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [id, nama, nis, jenis_kelamin, alamat, no_hp, id_kelas, username], callback);
  },

  // Update siswa profile
  update: (id, siswaData, callback) => {
    const { nama, nis, jenis_kelamin, alamat, no_hp, id_kelas } = siswaData;
    const sql = `
      UPDATE siswa 
      SET nama = ?, nis = ?, jenis_kelamin = ?, alamat = ?, no_hp = ?, id_kelas = ?
      WHERE id = ?
    `;
    db.query(sql, [nama, nis, jenis_kelamin, alamat, no_hp, id_kelas, id], callback);
  }
};

module.exports = Siswa;
