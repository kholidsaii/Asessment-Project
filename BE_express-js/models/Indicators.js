const db = require("../config/database");

const Indicator = {
  getAll: async () => {
    // MySQL2 Promise mengembalikan array [rows, fields]
    const [rows] = await db.query("SELECT * FROM indicators");
    return rows;
  },
  
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM indicators WHERE id=?", [id]);
    return rows;
  },
  
  create: async (data) => {
    const sql = "INSERT INTO indicators (name, description) VALUES (?, ?)";
    const [result] = await db.execute(sql, [data.name, data.description]);
    return result;
  },
  
  update: async (id, data) => {
    const sql = "UPDATE indicators SET name = ?, description = ? WHERE id = ?";
    const [result] = await db.execute(sql, [data.name, data.description, id]);
    return result;
  },
  
  delete: async (id) => {
    const [result] = await db.execute("DELETE FROM indicators WHERE id=?", [id]);
    return result;
  }
};

module.exports = Indicator;