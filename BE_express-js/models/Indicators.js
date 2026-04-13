const db = require("../config/database");

const Indicator = {
  getAll: (callback) => {
    db.query("SELECT * FROM indicators", callback);
  },
  create: (data, callback) => {
    // Sesuaikan kolomnya dengan tabel kamu (misal: name, unit)
    const sql = "INSERT INTO indicators (name, description) VALUES (?, ?)";
    db.query(sql, [data.name, data.description], callback);
  },
  update: (id, data, callback) => {
    const sql = "UPDATE indicators SET name = ?, description = ? WHERE id = ?";
    db.query(sql, [data.name, data.description, id], callback);
  },
  delete: (id, callback) => {
    db.query("DELETE FROM indicators WHERE id=?", [id], callback);
  }
};

module.exports = Indicator;