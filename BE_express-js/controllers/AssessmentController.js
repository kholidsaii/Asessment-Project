const Assessment = require("../models/Assessment");
const errorHandler = require("../utils/errorHandler");
const { validateFile } = require("../utils/validator");

class AssessmentController {
  submitScore(req, res) {
    const { hospital_id, question_id, score } = req.body;

    const numericScore = Number(score);

    if (!hospital_id || !question_id || Number.isNaN(numericScore)) {
      return errorHandler(res, "Data tidak lengkap", 400, "Data tidak lengkap");
    }

    if (![0, 5, 10].includes(numericScore)) {
      return errorHandler(
        res,
        "Skor tidak valid",
        400,
        "Skor hanya boleh bernilai 0, 5, atau 10"
      );
    }

    const fileError = validateFile(req.file);
    if (fileError) {
      return errorHandler(res, fileError, 400, fileError);
    }

    const photo = req.file ? req.file.filename : null;

    Assessment.saveScore(
      { hospital_id, question_id, score: numericScore, photo },
      (err) => {
        if (err) {
          console.error("Error submit assessment:", err);
          return errorHandler(res, err, 500, "Gagal menyimpan skor assessment");
        }

        res.json({
          success: true,
          message: "Skor berhasil disimpan",
          data: {
            hospital_id,
            question_id,
            score: numericScore,
            photo,
          },
        });
      }
    );
  }

  getHospitalReport(req, res) {
    const { hospital_id } = req.params;

    Assessment.getSummaryByHospital(hospital_id, (err, summaryResults) => {
      if (err) {
        console.error("Error report assessment summary:", err);
        return errorHandler(res, err, 500, "Gagal mengambil laporan");
      }

      if (!summaryResults || summaryResults.length === 0) {
        return errorHandler(
          res,
          "Data rumah sakit tidak ditemukan",
          404,
          "Data rumah sakit tidak ditemukan"
        );
      }

      Assessment.getDetailByHospital(hospital_id, (detailErr, detailResults) => {
        if (detailErr) {
          console.error("Error report assessment detail:", detailErr);
          return errorHandler(res, detailErr, 500, "Gagal mengambil detail laporan");
        }

        res.json({
          success: true,
          message: "Berhasil mengambil rekap laporan",
          data: {
            ...summaryResults[0],
            details: detailResults || [],
          },
        });
      });
    });
  }

  getLatestActivities(req, res) {
    Assessment.getLatestActivities(5, (err, results) => {
      if (err) {
        console.error("Error latest activities:", err);
        return errorHandler(res, err, 500, "Gagal mengambil aktivitas terbaru");
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
