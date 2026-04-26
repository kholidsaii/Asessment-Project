const db = require("../config/database");

const Assessment = {
  // Simpan atau Update Skor
  saveScore: async (data) => {
    const sql = `
      INSERT INTO assessments (hospital_id, question_id, score) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE score = VALUES(score)
    `;
    const [result] = await db.execute(sql, [data.hospital_id, data.question_id, data.score]);
    return result;
  },

  // Ambil rekap per RS (Total Skor dan Rata-rata)
  getSummaryByHospital: async (hospitalId) => {
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
    const [rows] = await db.query(sql, [hospitalId]);
    return rows[0];
  }
};

module.exports = Assessment;