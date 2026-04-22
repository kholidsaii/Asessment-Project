const db = require("../config/db"); // Menggunakan pool mysql2
const { validateIndicator } = require("../utils/validator");
const errorHandler = require("../utils/errorHandler");

class IndicatorController {
  // 1. Ambil Semua Indikator
  async index(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM indicators");
      
      if (rows.length === 0) {
        return res.status(404).json({ message: "Data indikator kosong" });
      }

      res.json({
        success: true,
        message: "Berhasil ambil semua indikator (Native SQL)",
        data: rows
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil data indikator");
    }
  }

  // 2. Detail Indikator
  async show(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query("SELECT * FROM indicators WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Indikator tidak ditemukan" });
      }

      res.json({
        success: true,
        message: "Detail indikator",
        data: rows[0]
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil detail indikator");
    }
  }

  // 3. Simpan Indikator
  async store(req, res) {
    try {
      const data = req.body;

      // Jalankan Validasi
      const validation = validateIndicator(data);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validasi gagal",
          errors: validation.errors
        });
      }

      const sql = "INSERT INTO indicators (name, description) VALUES (?, ?)";
      const [result] = await db.execute(sql, [data.name, data.description]);

      res.status(201).json({
        success: true,
        message: "Indikator berhasil ditambahkan",
        data: { id: result.insertId, ...data }
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

      const sql = "UPDATE indicators SET name = ?, description = ? WHERE id = ?";
      await db.execute(sql, [data.name, data.description, id]);

      res.json({
        success: true,
        message: "Indikator berhasil diupdate",
        data: { id, ...data }
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal update indikator");
    }
  }

  // 5. Hapus Indikator
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await db.execute("DELETE FROM indicators WHERE id = ?", [id]);

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