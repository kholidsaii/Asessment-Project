const Assessment = require("../models/Assessment");
const errorHandler = require("../utils/errorHandler");

class AssessmentController {
  // Simpan skor baru atau update skor lama
  async submitScore(req, res) {
    console.log("--> Request masuk ke submitScore!");
    try {
      const { hospital_id, question_id, score } = req.body;

      // Validasi sederhana
      if (!hospital_id || !question_id || score === undefined) {
        return res.status(400).json({ success: false, message: "Data tidak lengkap" });
      }

      await Assessment.saveScore({ hospital_id, question_id, score });

      res.json({
        success: true,
        message: "Skor berhasil disimpan",
        data: { hospital_id, question_id, score }
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal menyimpan skor asessment");
    }
  }

  // Lihat hasil ringkasan asessment per RS
  async getHospitalReport(req, res) {
    try {
      const { hospital_id } = req.params;
      const report = await Assessment.getSummaryByHospital(hospital_id);

      if (!report) {
        return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
      }

      res.json({
        success: true,
        data: report
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal mengambil laporan asessment");
    }
  }
}

module.exports = new AssessmentController();