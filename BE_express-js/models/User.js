const db = require("../config/database");

const User = {
  // Ambil semua user (untuk list user)
  getAll: (callback) => {
    const sql = "SELECT id, name, email, createdAt FROM users";
    db.query(sql, callback);
  },

  // Ambil detail user berdasarkan ID
  getById: (id, callback) => {
    const sql = "SELECT id, name, email, createdAt FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Cari user berdasarkan email (penting untuk LOGIN nanti)
  getByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  // Tambah user baru (REGISTER)
  create: (data, callback) => {
    // data berisi { name, email, password }
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [data.name, data.email, data.password], callback);
  },

  // Hapus user
  delete: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }
};

module.exports = User;