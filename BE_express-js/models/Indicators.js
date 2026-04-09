const db = require("../config/database");

const Indicator = {
  getAll: (callback) => {
    db.query("SELECT * FROM indicators", callback);
  },
  create: (data, callback) => {
    // Sesuaikan kolomnya dengan tabel kamu (misal: name, unit)
    const sql = "INSERT INTO indicators (name, description) VALUES (?, ?)";
    db.query(sql, [data.name, data.description], callback);
  }
  // Tambahkan delete/update jika diperlukan
};

module.exports = Indicator;