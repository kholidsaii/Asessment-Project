const Question = require("../models/Question");
const errorHandler = require("../utils/errorHandler");

class QuestionController {

  // Ambil semua question berdasarkan category
  index(req, res) {
    const { category_id } = req.query;

    if (!category_id) {
      return errorHandler(res, "category_id wajib diisi", 400);
    }

    Question.getByCategory(category_id, (err, results) => {
      if (err) return errorHandler(res, err, 500);

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Data question kosong"
        });
      }

      res.json({
        success: true,
        message: "Berhasil ambil question",
        data: results
      });
    });
  }

  // Tambah question (admin)
  store(req, res) {
    const data = req.body;

    if (!data.category_id || !data.indicator) {
      return errorHandler(res, "Data tidak lengkap", 400);
    }

    Question.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500);

      res.status(201).json({
        success: true,
        message: "Question berhasil ditambahkan",
        data: { id: result.insertId, ...data }
      });
    });
  }
}

module.exports = new QuestionController();