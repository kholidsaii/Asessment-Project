const Hospital = require("../models/Hospitals");
const errorHandler = require("../utils/errorHandler");
const { validateHospital } = require("../utils/validator");

class HospitalController {
  // 1. Ambil Semua Data
  async index(req, res) {
    try {
      const results = await Hospital.getAll();
      
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Data hospital kosong" 
        });
      }

      res.json({
        success: true,
        message: "Berhasil ambil semua data hospital",
        data: results
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil data hospital");
    }
  }

  // 2. Detail Hospital
  async show(req, res) {
    try {
      const { id } = req.params;
      const results = await Hospital.getById(id);

      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Hospital tidak ditemukan" 
        });
      }

      res.json({
        success: true,
        message: "Detail hospital",
        data: results[0]
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil detail hospital");
    }
  }

  // 3. Simpan Data (Create)
  async store(req, res) {
    try {
      const data = req.body;
      const { isValid, errors } = validateHospital(data);

      if (!isValid) {
        return res.status(400).json({ 
          success: false, 
          message: "Validasi input gagal", 
          errors 
        });
      }

      const result = await Hospital.create(data);
      res.status(201).json({
        success: true,
        message: "Hospital berhasil ditambahkan",
        data: { id: result.insertId, ...data }
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah hospital");
    }
  }

  // 4. Update Data
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const { isValid, errors } = validateHospital(data);

      if (!isValid) {
        return res.status(400).json({ 
          success: false, 
          message: "Validasi input gagal", 
          errors 
        });
      }

      await Hospital.update(id, data);
      res.json({
        success: true,
        message: "Hospital berhasil diupdate"
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal update hospital");
    }
  }

  // 5. Hapus Data
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await Hospital.delete(id);
      
      res.json({
        success: true,
        message: "Hospital berhasil dihapus"
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal hapus hospital");
    }
  }
}

module.exports = new HospitalController();