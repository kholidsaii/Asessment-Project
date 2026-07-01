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
        message: "Aktivitas terbaru berhasil diambil",
        data: results || [],
      });
    });
  }

  getAdminCharts(req, res) {
    Assessment.getAdminScoreByIndicator((indicatorErr, indicatorResults) => {
      if (indicatorErr) {
        console.error("Error admin chart indicator:", indicatorErr);
        return errorHandler(res, indicatorErr, 500, "Gagal mengambil grafik indikator");
      }

      Assessment.getAdminHospitalRanking((rankingErr, rankingResults) => {
        if (rankingErr) {
          console.error("Error admin chart ranking:", rankingErr);
          return errorHandler(res, rankingErr, 500, "Gagal mengambil ranking rumah sakit");
        }

        Assessment.getAdminAssessmentTrend((trendErr, trendResults) => {
          if (trendErr) {
            console.error("Error admin chart trend:", trendErr);
            return errorHandler(res, trendErr, 500, "Gagal mengambil tren assessment");
          }

          res.json({
            success: true,
            message: "Grafik dashboard admin berhasil diambil",
            data: {
              scoreByIndicator: indicatorResults || [],
              hospitalRanking: rankingResults || [],
              assessmentTrend: trendResults || [],
            },
          });
        });
      });
    });
  }

  getUserCharts(req, res) {
    const { hospital_id } = req.params;

    Assessment.getSummaryByHospital(hospital_id, (summaryErr, summaryResults) => {
      if (summaryErr) {
        console.error("Error user chart summary:", summaryErr);
        return errorHandler(res, summaryErr, 500, "Gagal mengambil ringkasan grafik user");
      }

      Assessment.getDetailByHospital(hospital_id, (detailErr, detailResults) => {
        if (detailErr) {
          console.error("Error user chart detail:", detailErr);
          return errorHandler(res, detailErr, 500, "Gagal mengambil detail grafik user");
        }

        const summary = summaryResults?.[0] || {};
        const totalQuestions = Number(summary.total_questions || 0);
        const totalEvaluated = Number(summary.total_evaluated || 0);
        const notEvaluated = Math.max(totalQuestions - totalEvaluated, 0);

        res.json({
          success: true,
          message: "Grafik dashboard user berhasil diambil",
          data: {
            scoreByIndicator: detailResults || [],
            progress: [
              { name: "Sudah Dinilai", value: totalEvaluated },
              { name: "Belum Dinilai", value: notEvaluated },
            ],
          },
        });
      });
    });
  }
}

module.exports = new AssessmentController();
