const Indicator = require("../models/Indicators");
const { validateIndicator } = require("../utils/validator");
const errorHandler = require("../utils/errorHandler");

class IndicatorController {

  async index(req, res) {
    try {
      const results = await Indicator.getAll();
      
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Data indikator kosong" });
      }

      res.json({
        success: true,
        message: "Berhasil ambil semua indikator",
        data: results
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil data indikator");
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const results = await Indicator.getById(id);

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Indikator tidak ditemukan" });
      }

      res.json({
        success: true,
        message: "Detail indikator",
        data: results[0]
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil detail indikator");
    }
  }

  async store(req, res) {
    try {
      const data = req.body;
      const error = validateIndicator(data);
      if (error) return errorHandler(res, error, 400, error);

      const result = await Indicator.create(data);
      res.status(201).json({
        success: true,
        message: "Indikator berhasil ditambahkan",
        data: { id: result.insertId, ...data }
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah indikator");
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const error = validateIndicator(data);
      if (error) return errorHandler(res, error, 400, error);

      await Indicator.update(id, data);
      res.json({ success: true, message: "Indikator berhasil diupdate" });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal update indikator");
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      await Indicator.delete(id);
      res.json({ success: true, message: "Indikator berhasil dihapus" });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal hapus indikator");
    }
  }
}

module.exports = new IndicatorController();