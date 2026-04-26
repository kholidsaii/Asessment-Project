const db = require("../config/database");

const Question = {
  getByCategory: async (categoryId) => {
    const [rows] = await db.query(
      "SELECT * FROM questions WHERE category_id = ?", 
      [categoryId]
    );
    return rows;
  },
  create: async (data) => {
    const [result] = await db.execute(
      "INSERT INTO questions (category_id, indicator) VALUES (?, ?)",
      [data.category_id, data.indicator]
    );
    return result;
  }
};

module.exports = Question;