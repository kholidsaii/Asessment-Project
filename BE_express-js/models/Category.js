const db = require("../config/database");

const Category = {

  getAll: (callback) => {
    db.query("SELECT * FROM categories", callback);
  },

  create: (data, callback) => {
    const sql = "INSERT INTO categories (name, slug, `group`) VALUES (?, ?, ?)";
    db.query(sql, [
      data.name,
      data.slug,
      data.group
    ], callback);
  }

};

module.exports = Category;