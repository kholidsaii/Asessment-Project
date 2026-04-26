const mysql = require("mysql2");

// Kita gunakan createPool karena lebih stabil untuk aplikasi web (multi-koneksi)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "hospital_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// KUNCINYA DI SINI: Tambahkan .promise() agar bisa pakai await di Controller
const poolPromise = db.promise();

// Tes koneksi di awal
poolPromise.getConnection()
  .then(() => console.log("Database Connected via Native MySQL (Promise)!"))
  .catch((err) => console.error("Database connection failed:", err.message));

module.exports = poolPromise;