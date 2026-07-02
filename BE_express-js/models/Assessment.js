const db = require("../config/database");

const Assessment = {

  saveScore: (data, callback) => {
    const sql = `
      INSERT INTO assessments (hospital_id, question_id, score, photo)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        score = VALUES(score),
        photo = VALUES(photo)
    `;

    db.query(
      sql,
      [data.hospital_id, data.question_id, data.score, data.photo],
      callback
    );
  },

  getSummaryByHospital: (hospitalId, callback) => {
    const sql = `
      SELECT 
        h.name as hospital_name,
        SUM(a.score) as total_score,
        AVG(a.score) as average_score,
        COUNT(a.id) as total_answered_questions
      FROM hospitals h
      LEFT JOIN assessments a ON h.id = a.hospital_id
      WHERE h.id = ?
      GROUP BY h.id
    `;

    db.query(sql, [hospitalId], callback);
  },
  getAnswersByHospital: (hospitalId, callback) => {
    const sql = "SELECT question_id, score FROM assessments WHERE hospital_id = ?";
    db.query(sql, [hospitalId], callback);
  },
};

module.exports = Assessment;