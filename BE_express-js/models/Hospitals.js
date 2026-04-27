const db = require("../config/database");

const Hospital = {

  getAll: (callback) => {
    db.query("SELECT * FROM hospitals", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM hospitals WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    const sql = "INSERT INTO hospitals (name, code, class, address) VALUES (?, ?, ?, ?)";
    db.query(sql, [
      data.name,
      data.code,
      data.class,
      data.address
    ], callback);
  },

  update: (id, data, callback) => {
    const sql = "UPDATE hospitals SET name=?, code=?, class=?, address=? WHERE id=?";
    db.query(sql, [
      data.name,
      data.code,
      data.class,
      data.address,
      id
    ], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM hospitals WHERE id=?", [id], callback);
  }

};

module.exports = Hospital;