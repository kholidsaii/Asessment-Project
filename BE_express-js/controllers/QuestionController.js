const Question = require("../models/Question");
const errorHandler = require("../utils/errorHandler");

class QuestionController {

  // Ambil semua question (Bisa di-filter berdasarkan category jika ada query URL)
  index(req, res) {
    const { category_id } = req.query;

    if (category_id) {
      // Skenario 1: Dipanggil dari halaman Assessment (/questions?category_id=1)
      Question.getByCategory(category_id, (err, results) => {
        if (err) return errorHandler(res, err, 500);

        if (results.length === 0) {
          return res.status(404).json({ success: false, message: "Data question kosong" });
        }

        res.json({ success: true, message: "Berhasil ambil question by kategori", data: results });
      });
    } else {
      // Skenario 2: Dipanggil dari halaman Master Data (/questions)
      Question.getAll((err, results) => {
        if (err) return errorHandler(res, err, 500);

        res.json({ success: true, message: "Berhasil ambil semua question", data: results });
      });
    }
  }

  // Menampilkan 1 data untuk form Edit
  show(req, res) {
    const { id } = req.params;
    
    Question.getById(id, (err, results) => {
      if (err) return errorHandler(res, err, 500);
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Question tidak ditemukan" });
      }

      res.json({ success: true, message: "Detail question", data: results[0] });
    });
  }

  // Tambah question
  store(req, res) {
    const data = req.body;

    if (!data.category_id || (!data.indicator && !data.question)) {
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

  // Edit question
  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    if (!data.category_id || (!data.indicator && !data.question)) {
      return errorHandler(res, "Data tidak lengkap", 400);
    }

    Question.update(id, data, (err) => {
      if (err) return errorHandler(res, err, 500);
      res.json({ success: true, message: "Question berhasil diupdate" });
    });
  }

  // Hapus question
  destroy(req, res) {
    const { id } = req.params;

    Question.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500);
      res.json({ success: true, message: "Question berhasil dihapus" });
    });
  }
}

module.exports = new QuestionController();