const db = require("../config/database");

const Question = {
  getAll: (callback) => {
    const sql = `
      SELECT
        q.id,
        q.indicator_id,
        q.question_text,
        i.name AS indicator_name,
        i.description AS indicator_description
      FROM questions q
      LEFT JOIN indicators i ON q.indicator_id = i.id
      ORDER BY q.id DESC
    `;

    db.query(sql, callback);
  },

  getByIndicator: (indicatorId, callback) => {
    const sql = `
      SELECT
        q.id,
        q.indicator_id,
        q.question_text,
        i.name AS indicator_name,
        i.description AS indicator_description
      FROM questions q
      LEFT JOIN indicators i ON q.indicator_id = i.id
      WHERE q.indicator_id = ?
      ORDER BY q.id ASC
    `;

    db.query(sql, [indicatorId], callback);
  },

  getById: (id, callback) => {
    const sql = `
      SELECT
        q.id,
        q.indicator_id,
        q.question_text,
        i.name AS indicator_name,
        i.description AS indicator_description
      FROM questions q
      LEFT JOIN indicators i ON q.indicator_id = i.id
      WHERE q.id = ?
    `;

    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO questions (indicator_id, question_text)
      VALUES (?, ?)
    `;

    db.query(sql, [data.indicator_id, data.question_text], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE questions
      SET indicator_id = ?, question_text = ?
      WHERE id = ?
    `;

    db.query(sql, [data.indicator_id, data.question_text, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM questions WHERE id = ?", [id], callback);
  },
};

module.exports = Question;
