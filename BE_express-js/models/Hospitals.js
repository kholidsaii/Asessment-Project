const db = require("../config/database");

const Hospital = {

  getAll: (callback) => {
    db.query("SELECT * FROM hospitals", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM hospitals WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    // Tanda tanya disesuaikan jadi 5 agar pas dengan jumlah data
    const sql = "INSERT INTO hospitals (name, code, class, address) VALUES (?, ?, ?, ?)";
    db.query(sql, [
      data.name,
      data.code,
      data.class,
      data.address
    ], callback);
  },

  update: (id, data, callback) => {
    // Menambahkan category_id agar bisa diupdate
    const sql = "UPDATE hospitals SET name=?, code=?, class=?, address=? WHERE id=?";
    db.query(sql, [
      data.name,
      data.code,
      data.class,
      data.address,
      id
    ], callback);
  },

  getStats: (callback) => {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM hospitals) AS totalHospitals,
        (SELECT COUNT(*) FROM users) AS totalUsers,
        (SELECT COUNT(*) FROM indicators) AS totalIndicators,
        (SELECT COUNT(*) FROM assessments) AS totalAssessments,
        (SELECT COUNT(DISTINCT hospital_id) FROM assessments) AS assessedHospitals,
        ROUND(IFNULL((SELECT AVG(score) FROM assessments), 0), 2) AS averageScore
    `;

    db.query(sql, callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM hospitals WHERE id=?", [id], callback);
  }

};

module.exports = Hospital;