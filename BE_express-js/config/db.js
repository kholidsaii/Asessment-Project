const mysql = require('mysql2');

// Buat pool koneksi agar lebih stabil
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Default XAMPP
  password: '',      // Default XAMPP (kosong)
  database: 'hospital_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Gunakan .promise() supaya kita bisa pakai async/await seperti Prisma tadi
module.exports = pool.promise();