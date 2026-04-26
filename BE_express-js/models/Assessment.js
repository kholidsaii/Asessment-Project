const db = require("../config/database");

const Assessment = {
  // Simpan atau Update Skor (Upsert logic)
  saveScore: async (data) => {
    const sql = `
      INSERT INTO assessments (hospital_id, question_id, score) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE score = VALUES(score)
    `;
    const [result] = await db.execute(sql, [
      data.hospital_id, 
      data.question_id, 
      data.score
    ]);
    return result;
  },

  // Ambil rekap skor per Rumah Sakit
  getHospitalReport: async (hospitalId) => {
    const sql = `
      SELECT q.indicator, a.score, c.name as category_name
      FROM assessments a
      JOIN questions q ON a.question_id = q.id
      JOIN categories c ON q.category_id = c.id
      WHERE a.hospital_id = ?
    `;
    const [rows] = await db.query(sql, [hospitalId]);
    return rows;
  }
};

module.exports = Assessment;