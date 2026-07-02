const db = require("../config/database");

const Assessment = {
  saveScore: (data, callback) => {
    const sql = `
      INSERT INTO assessments (hospital_id, question_id, score, photo)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        score = VALUES(score),
        photo = VALUES(photo),
        updated_at = CURRENT_TIMESTAMP
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
        h.id AS hospital_id,
        h.name AS hospital_name,
        COUNT(a.id) AS total_evaluated,
        COUNT(DISTINCT q.indicator_id) AS total_indicators_evaluated,
        (SELECT COUNT(*) FROM questions) AS total_questions,
        ROUND(IFNULL(SUM(a.score), 0), 2) AS total_score,
        ROUND(IFNULL(AVG(a.score), 0), 2) AS average_score,
        ROUND(
          IFNULL(
            (COUNT(a.id) / NULLIF((SELECT COUNT(*) FROM questions), 0)) * 100,
            0
          ),
          2
        ) AS completion_percentage,
        CASE
          WHEN COUNT(a.id) = 0 THEN 'Belum ada penilaian'
          WHEN AVG(a.score) >= 8 THEN 'Sangat Baik'
          WHEN AVG(a.score) >= 6 THEN 'Baik'
          WHEN AVG(a.score) >= 4 THEN 'Cukup'
          ELSE 'Perlu Perbaikan'
        END AS evaluation_status
      FROM hospitals h
      LEFT JOIN assessments a ON h.id = a.hospital_id
      LEFT JOIN questions q ON a.question_id = q.id
      WHERE h.id = ?
      GROUP BY h.id, h.name
    `;

    db.query(sql, [hospitalId], callback);
  },

  getDetailByHospital: (hospitalId, callback) => {
    const sql = `
      SELECT
        i.id AS indicator_id,
        i.name AS indicator_name,
        COUNT(q.id) AS total_questions,
        COUNT(a.id) AS answered_questions,
        ROUND(IFNULL(AVG(a.score), 0), 2) AS average_score,
        ROUND(
          IFNULL((COUNT(a.id) / NULLIF(COUNT(q.id), 0)) * 100, 0),
          2
        ) AS completion_percentage,
        CASE
          WHEN COUNT(a.id) = 0 THEN 'Belum dinilai'
          WHEN AVG(a.score) >= 8 THEN 'Sangat Baik'
          WHEN AVG(a.score) >= 6 THEN 'Baik'
          WHEN AVG(a.score) >= 4 THEN 'Cukup'
          ELSE 'Perlu Perbaikan'
        END AS evaluation_status
      FROM indicators i
      LEFT JOIN questions q ON q.indicator_id = i.id
      LEFT JOIN assessments a ON a.question_id = q.id AND a.hospital_id = ?
      GROUP BY i.id, i.name
      ORDER BY i.id ASC
    `;

    db.query(sql, [hospitalId], callback);
  },

  getLatestActivities: (limit = 5, callback) => {
    const safeLimit = Number(limit) || 5;

    const sql = `
      SELECT
        a.id,
        a.hospital_id,
        a.question_id,
        a.score,
        a.photo,
        a.created_at,
        a.updated_at,
        h.name AS hospital_name,
        q.question_text AS question_text,
        i.name AS indicator_name
      FROM assessments a
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      LEFT JOIN questions q ON a.question_id = q.id
      LEFT JOIN indicators i ON q.indicator_id = i.id
      ORDER BY a.updated_at DESC, a.id DESC
      LIMIT ?
    `;

    db.query(sql, [safeLimit], callback);
  },

  getAdminScoreByIndicator: (callback) => {
    const sql = `
      SELECT
        i.id AS indicator_id,
        i.name AS indicator_name,
        COUNT(a.id) AS total_assessments,
        ROUND(IFNULL(AVG(a.score), 0), 2) AS average_score
      FROM indicators i
      LEFT JOIN questions q ON q.indicator_id = i.id
      LEFT JOIN assessments a ON a.question_id = q.id
      GROUP BY i.id, i.name
      ORDER BY i.id ASC
    `;

    db.query(sql, callback);
  },

  getAdminHospitalRanking: (callback) => {
    const sql = `
      SELECT
        h.id AS hospital_id,
        h.name AS hospital_name,
        COUNT(a.id) AS total_evaluated,
        ROUND(IFNULL(AVG(a.score), 0), 2) AS average_score
      FROM hospitals h
      LEFT JOIN assessments a ON a.hospital_id = h.id
      GROUP BY h.id, h.name
      ORDER BY average_score DESC, total_evaluated DESC, h.name ASC
      LIMIT 5
    `;

    db.query(sql, callback);
  },

  getAdminAssessmentTrend: (callback) => {
    const sql = `
      SELECT
        DATE(COALESCE(a.updated_at, a.created_at)) AS assessment_date,
        COUNT(*) AS total_assessments
      FROM assessments a
      GROUP BY DATE(COALESCE(a.updated_at, a.created_at))
      ORDER BY assessment_date ASC
      LIMIT 7
    `;

    db.query(sql, callback);
  },
};

module.exports = Assessment;
