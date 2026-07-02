const db = require("../config/database");

const User = {
  getAll: (callback) => {
    const sql = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.hospital_id,
        h.name AS hospital_name
      FROM users u
      LEFT JOIN hospitals h ON u.hospital_id = h.id
      ORDER BY u.id DESC
    `;
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.hospital_id,
        h.name AS hospital_name
      FROM users u
      LEFT JOIN hospitals h ON u.hospital_id = h.id
      WHERE u.id = ?
    `;
    db.query(sql, [id], callback);
  },

  getByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO users (name, email, password, role, hospital_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.name,
        data.email,
        data.password,
        data.role || "user",
        data.hospital_id || null,
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const fields = ["name = ?", "email = ?", "role = ?", "hospital_id = ?"];
    const values = [
      data.name,
      data.email,
      data.role || "user",
      data.hospital_id || null,
    ];

    if (data.password) {
      fields.push("password = ?");
      values.push(data.password);
    }

    values.push(id);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    db.query(sql, values, callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = User;
