const Indicator = require("../models/Indicators");
const { validateIndicator } = require("../utils/validator");
const errorHandler = require("../utils/errorHandler");

class IndicatorController {

  index(req, res) {
    Indicator.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil data indikator");

      res.json({
        success: true,
        message: "Berhasil ambil semua indikator",
        data: results || []
      });
    });
  }

  show(req, res) {
    const { id } = req.params;

    Indicator.getById(id, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil detail indikator");

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Indikator tidak ditemukan"
        });
      }

      res.json({
        success: true,
        message: "Detail indikator berhasil diambil",
        data: results[0]
      });
    });
  }

  store(req, res) {
    const data = req.body;

    const { isValid, errors } = validateIndicator(data);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors
      });
    }

    Indicator.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal menambahkan indikator");

      res.status(201).json({
        success: true,
        message: "Indikator berhasil ditambahkan",
        data: { id: result.insertId, ...data }
      });
    });
  }

  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    const { isValid, errors } = validateIndicator(data);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors
      });
    }

    Indicator.update(id, data, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengupdate indikator");

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Indikator tidak ditemukan atau tidak ada data yang berubah"
        });
      }

      res.json({
        success: true,
        message: "Indikator berhasil diupdate"
      });
    });
  }

  destroy(req, res) {
    const { id } = req.params;

    Indicator.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500);

      res.json({
        success: true,
        message: "Indikator berhasil dihapus"
      });
    });
  }
}

module.exports = new IndicatorController();