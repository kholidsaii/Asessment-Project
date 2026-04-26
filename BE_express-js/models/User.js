const db = require("../config/database"); // Pastikan path ke config db benar

const User = {
  getAll: async () => {
    const [rows] = await db.query("SELECT id, name, email, role, createdAt FROM users");
    return rows;
  },

  getByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows;
  },

  create: async (data) => {
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [
      data.name, 
      data.email, 
      data.password, 
      data.role || 'user'
    ]);
    return result;
  },

  delete: async (id) => {
    return await db.execute("DELETE FROM users WHERE id = ?", [id]);
  }
};

module.exports = User;