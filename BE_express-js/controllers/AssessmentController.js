const Assessment = require("../models/Assessment");
const errorHandler = require("../utils/errorHandler");
const { validateFile } = require("../utils/validator");

class AssessmentController {

  // ===============================
  // 1. SUBMIT / UPDATE SCORE
  // ===============================
  submitScore(req, res) {
    const { hospital_id, question_id, score } = req.body;

    // Validasi basic input
    if (!hospital_id || !question_id || score === undefined || isNaN(score)) {
      return errorHandler(res, "Data tidak lengkap", 400, "Data tidak lengkap");
    }

    // Validasi file (optional)
    const fileError = validateFile(req.file);
    if (fileError) {
      return errorHandler(res, fileError, 400, fileError);
    }

    // Ambil nama file
    const photo = req.file ? req.file.filename : null;

    // Simpan ke database (pakai callback style)
    Assessment.saveScore(
      { hospital_id, question_id, score, photo },
      (err, result) => {
        if (err) {
          return errorHandler(res, err, 500, "Gagal menyimpan skor assessment");
        }

        res.json({
          success: true,
          message: "Skor berhasil disimpan",
          data: {
            hospital_id,
            question_id,
            score,
            photo: photo
          }
        });
      }
    );
  }

  // ===============================
  // 2. GET REPORT
  // ===============================
  getHospitalReport(req, res) {
    const { hospital_id } = req.params;

    Assessment.getSummaryByHospital(hospital_id, (err, results) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal mengambil laporan");
      }

      if (!results || results.length === 0) {
        return errorHandler(res, "Data tidak ditemukan", 404, "Data laporan tidak ditemukan");
      }

      res.json({
        success: true,
        message: "Berhasil mengambil rekap laporan",
        // PERBAIKAN: Hapus [0] agar mengembalikan array seluruh jawaban
        data: results 
      });
    });
  }
  getAnswers(req, res) {
    const { hospital_id } = req.params;

    // Pastikan model Assessment kamu sudah di-require di bagian atas file ini
    const Assessment = require("../models/Assessment"); 

    Assessment.getAnswersByHospital(hospital_id, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Gagal mengambil riwayat jawaban" });
      }

      res.json({
        success: true,
        message: "Berhasil mengambil riwayat jawaban",
        data: results // Mengembalikan array [{question_id: 1, score: 1}, ...]
      });
    });
  }
}

module.exports = new AssessmentController();