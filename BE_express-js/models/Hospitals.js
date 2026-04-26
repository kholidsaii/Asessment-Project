const db = require("../config/database"); // Pastikan path ke config database benar

const Hospital = {
  // Ambil semua data
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM hospitals");
    return rows;
  },

  // Ambil detail berdasarkan ID
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM hospitals WHERE id = ?", [id]);
    return rows;
  },

  // Tambah hospital baru
  create: async (data) => {
    const sql = "INSERT INTO hospitals (name, code, class, address) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [
      data.name, 
      data.code, 
      data.class, 
      data.address || ''
    ]);
    return result;
  },

  // Update data hospital
  update: async (id, data) => {
    const sql = "UPDATE hospitals SET name=?, code=?, class=?, address=? WHERE id=?";
    const [result] = await db.execute(sql, [
      data.name, 
      data.code, 
      data.class, 
      data.address, 
      id
    ]);
    return result;
  },

  // Hapus hospital
  delete: async (id) => {
    const [result] = await db.execute("DELETE FROM hospitals WHERE id=?", [id]);
    return result;
  }
};

module.exports = Hospital;