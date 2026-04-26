const db = require("../config/database");

const Category = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM categories");
    return rows;
  },
  create: async (data) => {
    const [result] = await db.execute(
      "INSERT INTO categories (name, slug, `group`) VALUES (?, ?, ?)",
      [data.name, data.slug, data.group]
    );
    return result;
  }
};

module.exports = Category;