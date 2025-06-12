// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Ganti dari createConnection menjadi createPool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'absensi_app',
    port: process.env.DB_PORT || 3306,
    // Opsi tambahan untuk pool agar lebih kuat
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Opsi tambahan untuk mengatasi timeout dan reconnect
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
});

// Kita tidak perlu lagi blok db.connect(), karena pool mengelola koneksi secara otomatis.
// Saat ada query, pool akan memastikan koneksinya ada dan siap.

console.log('✅ Database connection pool created.');

// Test koneksi pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database pool connection failed:', err.stack);
        return;
    }
    console.log('✅ Database pool connection test successful!');
    connection.release(); // Release connection back to pool
});

// Ekspor 'pool' nya, bukan 'db' lagi
module.exports = pool;
