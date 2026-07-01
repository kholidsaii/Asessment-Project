const db = require("../config/database");

const Question = {
  // 1. Ambil semua data (Untuk halaman Master)
  getAll: (callback) => {
    db.query("SELECT * FROM questions", callback);
  },

  // 2. Ambil berdasarkan Kategori (Untuk halaman Assessment)
  getByCategory: (categoryId, callback) => {
    db.query(
      "SELECT * FROM questions WHERE category_id = ?",
      [categoryId],
      callback
    );
  },

  // 3. Ambil 1 data spesifik (Untuk form Edit)
  getById: (id, callback) => {
    db.query("SELECT * FROM questions WHERE id = ?", [id], callback);
  },

  // 4. Tambah data
  create: (data, callback) => {
    const sql = "INSERT INTO questions (category_id, indicator) VALUES (?, ?)";
    // Mendukung input 'question' dari frontend atau 'indicator' bawaan
    const textData = data.question || data.indicator;
    
    db.query(sql, [data.category_id, textData], callback);
  },

  // 5. Ubah data
  update: (id, data, callback) => {
    const sql = "UPDATE questions SET category_id = ?, indicator = ? WHERE id = ?";
    const textData = data.question || data.indicator;
    
    db.query(sql, [data.category_id, textData, id], callback);
  },

  // 6. Hapus data
  delete: (id, callback) => {
    db.query("DELETE FROM questions WHERE id = ?", [id], callback);
  }
};

module.exports = Question;