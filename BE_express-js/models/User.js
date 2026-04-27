const db = require("../config/database");

const User = {
  getAll: (callback) => {
    const sql = "SELECT id, name, email, role, createdAt FROM users";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT id, name, email, role, createdAt FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  getByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  create: (data, callback) => {
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [
      data.name,
      data.email,
      data.password,
      data.role || "user"
    ], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }
};

module.exports = User;