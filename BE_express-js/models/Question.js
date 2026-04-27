const db = require("../config/database");

const Question = {

  getByCategory: (categoryId, callback) => {
    db.query(
      "SELECT * FROM questions WHERE category_id = ?",
      [categoryId],
      callback
    );
  },

  create: (data, callback) => {
    const sql = "INSERT INTO questions (category_id, indicator) VALUES (?, ?)";
    db.query(sql, [
      data.category_id,
      data.indicator
    ], callback);
  }

};

module.exports = Question;