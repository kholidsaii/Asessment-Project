const db = require("../config/database");

const Hospital = {

  getAll: (callback)=>{
    const sql = "SELECT * FROM hospital";
    db.query(sql, callback);
  },

  getById: (id, callback)=>{
    const sql = "SELECT * FROM hospital WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback)=>{
    const sql = "INSERT INTO hospital (name, code, class) VALUES (?, ?, ?)";
    db.query(sql, [data.name, data.code, data.class], callback);
  },

  update: (id, data, callback)=>{
    const sql = "UPDATE hospital SET name=?, code=?, class=? WHERE id=?";
    db.query(sql, [data.name, data.code, data.class, id], callback);
  },

  delete: (id, callback)=>{
    const sql = "DELETE FROM hospital WHERE id=?";
    db.query(sql, [id], callback);
  }

}

module.exports = Hospital;