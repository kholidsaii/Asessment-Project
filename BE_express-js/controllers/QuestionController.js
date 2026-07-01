const Question = require("../models/Question");
const errorHandler = require("../utils/errorHandler");

class QuestionController {
  index(req, res) {
    const { indicator_id } = req.query;

    const query = indicator_id
      ? (callback) => Question.getByIndicator(indicator_id, callback)
      : (callback) => Question.getAll(callback);

    query((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil data pertanyaan");

      res.json({
        success: true,
        message: "Data pertanyaan berhasil diambil",
        data: results || [],
      });
    });
  }

  show(req, res) {
    const { id } = req.params;

    Question.getById(id, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil detail pertanyaan");

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pertanyaan tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Detail pertanyaan berhasil diambil",
        data: results[0],
      });
    });
  }

  store(req, res) {
    const data = req.body;

    if (!data.indicator_id || !data.question_text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Indikator dan teks pertanyaan wajib diisi",
      });
    }

    Question.create(
      {
        indicator_id: Number(data.indicator_id),
        question_text: data.question_text.trim(),
      },
      (err, result) => {
        if (err) return errorHandler(res, err, 500, "Gagal menambahkan pertanyaan");

        res.status(201).json({
          success: true,
          message: "Pertanyaan berhasil ditambahkan",
          data: { id: result.insertId, ...data },
        });
      }
    );
  }

  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    if (!data.indicator_id || !data.question_text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Indikator dan teks pertanyaan wajib diisi",
      });
    }

    Question.update(
      id,
      {
        indicator_id: Number(data.indicator_id),
        question_text: data.question_text.trim(),
      },
      (err, result) => {
        if (err) return errorHandler(res, err, 500, "Gagal mengupdate pertanyaan");

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Pertanyaan tidak ditemukan",
          });
        }

        res.json({
          success: true,
          message: "Pertanyaan berhasil diupdate",
        });
      }
    );
  }

  destroy(req, res) {
    const { id } = req.params;

    Question.delete(id, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal menghapus pertanyaan");

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Pertanyaan tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Pertanyaan berhasil dihapus",
      });
    });
  }
}

module.exports = new QuestionController();
