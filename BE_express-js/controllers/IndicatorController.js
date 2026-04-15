const { validateIndicator } = require("../utils/validator");
const prisma = require("../config/prisma");
const errorHandler = require("../utils/errorHandler");

class IndicatorController {
  // 1. Ambil Semua Indikator
  async index(req, res) {
    try {
      const results = await prisma.indicators.findMany();
      
      if (results.length === 0) {
        return res.status(404).json({ message: "Data indikator kosong" });
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

  // 2. Detail Indikator
  async show(req, res) {
    try {
      const { id } = req.params;
      const result = await prisma.indicators.findUnique({
        where: { id: parseInt(id) }
      });

      if (!result) {
        return res.status(404).json({ message: "Indikator tidak ditemukan" });
      }

      res.json({
        success: true,
        message: "Detail indikator",
        data: result
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil detail indikator");
    }
  }

  // 3. Simpan Indikator (INI YANG ERROR TADI)
  async store(req, res) {
    try {
      const data = req.body;

      // 🔥 VALIDATOR FIX
      const validation = validateIndicator(data);
      if (!validation.isValid) {
        // Kita kirim errors[0] atau seluruh array errors
        return res.status(400).json({
          success: false,
          message: "Validasi gagal",
          errors: validation.errors
        });
      }

      const newIndicator = await prisma.indicators.create({
        data: {
          name: data.name,
          description: data.description
        }
      });

      res.status(201).json({
        success: true,
        message: "Indikator berhasil ditambahkan",
        data: newIndicator
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah indikator");
    }
  }

  // 4. Update Indikator
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const validation = validateIndicator(data);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }

      const updated = await prisma.indicators.update({
        where: { id: parseInt(id) },
        data: {
          name: data.name,
          description: data.description
        }
      });

      res.json({
        success: true,
        message: "Indikator berhasil diupdate",
        data: updated
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal update indikator");
    }
  }

  // 5. Hapus Indikator
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await prisma.indicators.delete({
        where: { id: parseInt(id) }
      });

      res.json({
        success: true,
        message: "Indikator berhasil dihapus"
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal hapus indikator");
    }
  }
}

module.exports = new IndicatorController();