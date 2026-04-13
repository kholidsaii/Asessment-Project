const Indicator = require("../models/Indicators");
const { validateIndicator } = require("../utils/validator");
const errorHandler = require("../utils/errorHandler");

class IndicatorController {

  index(req, res) {
    Indicator.getAll((err, results) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal ambil data indikator");
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Data indikator kosong"
        });
      }

      res.json({
        message: "Berhasil ambil semua indikator",
        data: results
      });
    });
  }

  show(req, res) {
    const { id } = req.params;

    Indicator.getById(id, (err, results) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal ambil detail indikator");
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Indikator tidak ditemukan"
        });
      }

      res.json({
        message: "Detail indikator",
        data: results[0]
      });
    });
  }

  store(req, res) {
    const data = req.body;

    // 🔥 VALIDATOR
    const error = validateIndicator(data);
    if (error) {
      return errorHandler(res, error, 400, error);
    }

    Indicator.create(data, (err) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal tambah indikator");
      }

      res.status(201).json({
        message: "Indikator berhasil ditambahkan",
        data: data
      });
    });
  }

  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    // 🔥 VALIDATOR
    const error = validateIndicator(data);
    if (error) {
      return errorHandler(res, error, 400, error);
    }

    Indicator.update(id, data, (err) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal update indikator");
      }

      res.json({
        message: "Indikator berhasil diupdate"
      });
    });
  }

  destroy(req, res) {
    const { id } = req.params;

    Indicator.delete(id, (err) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal hapus indikator");
      }

      res.json({
        message: "Indikator berhasil dihapus"
      });
    });
  }
}

module.exports = new IndicatorController();