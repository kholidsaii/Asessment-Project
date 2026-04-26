const Assessment = require("../models/Assessment");
const errorHandler = require("../utils/errorHandler");
const { validateFile } = require("../utils/validator");

class AssessmentController {
  /**
   * Simpan atau Update Skor Asessment + Upload Foto Bukti
   * Menggunakan multipart/form-data
   */
  async submitScore(req, res) {
    try {
        const { hospital_id, question_id, score } = req.body;

        if (!hospital_id || !question_id || score === undefined) {
            return res.status(400).json({ success: false, message: "Data tidak lengkap" });
        }

        // 1. Validasi File (Hanya jika ada file yang diunggah) [cite: 292, 298]
        if (req.file) {
            const fileError = validateFile(req.file); // Fungsi ini mengembalikan string atau null [cite: 161]
            
            // Jika fileError berisi string (artinya ada error) [cite: 171, 178]
            if (fileError) {
                return errorHandler(res, fileError, 400, fileError); 
            }
        }

        // 2. Ambil nama file untuk disimpan ke database [cite: 209, 317]
        const evidence_photo = req.file ? req.file.filename : null; 

        // 3. Simpan ke Database
        await Assessment.saveScore({ 
            hospital_id, 
            question_id, 
            score, 
            evidence_photo 
        });

        res.json({
            success: true,
            message: "Skor berhasil disimpan",
            data: { hospital_id, question_id, score, photo: evidence_photo }
        });
    } catch (err) {
        // Error "Cannot read properties of null" akan ditangkap di sini [cite: 331, 340]
        return errorHandler(res, err, 500, "Gagal menyimpan skor asessment");
    }
}

  /**
   * Mengambil Laporan Rekapitulasi per Rumah Sakit
   */
  async getHospitalReport(req, res) {
    try {
      const { hospital_id } = req.params;
      const report = await Assessment.getSummaryByHospital(hospital_id);

      if (!report) {
        return res.status(404).json({ 
          success: false, 
          message: "Data laporan tidak ditemukan untuk RS ini" 
        });
      }

      res.json({
        success: true,
        message: "Berhasil mengambil rekap laporan",
        data: report
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal mengambil laporan");
    }
  }
}

module.exports = new AssessmentController();