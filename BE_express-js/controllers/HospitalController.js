const db = require("../config/database"); // Menggunakan pool mysql2
const Hospital = require("../models/Hospitals");
const errorHandler = require("../utils/errorHandler");
const { validateHospital } = require("../utils/validator"); // Import helper validasi

class HospitalController {

  index(req, res) {
    Hospital.getAll((err, results) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal ambil data hospital");
      }
      if (results.length == 0) {
        return errorHandler(res, "Data hospital kosong", 404, "Data hospital kosong");
      }
      res.json({
        success: true,
        message: "Berhasil ambil semua data hospital",
        data: results
      });
    });
  }

  show(req, res) {
    const { id } = req.params;
    Hospital.getById(id, (err, results) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal ambil detail hospital");
      }
      if (results.length == 0) {
        return errorHandler(res, "Hospital tidak ditemukan", 404, "Hospital tidak ditemukan");
      }
      res.json({
        success: true,
        message: "Detail hospital",
        data: results[0]
      });
    });
  }

  // SPRINT 5: Validasi pada CREATE
  store(req, res) {
    const data = req.body;

    // Jalankan validasi
    const { isValid, errors } = validateHospital(data);

    if (!isValid) {
      return errorHandler(res, errors, 400, "Validasi input gagal");
    }

    Hospital.create(data, (err) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal tambah hospital");
      }
      res.status(201).json({
        success: true,
        message: "Hospital berhasil ditambahkan",
        data: data
      });
    });
  }

  // SPRINT 5: Validasi pada UPDATE
  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    // Jalankan validasi
    const { isValid, errors } = validateHospital(data);

    if (!isValid) {
      return errorHandler(res, errors, 400, "Validasi input gagal");
    }

    Hospital.update(id, data, (err) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal update hospital");
      }
      res.json({
        success: true,
        message: "Hospital berhasil diupdate"
      });
    });
  }

  destroy(req, res) {
    const { id } = req.params;
    Hospital.delete(id, (err) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal hapus hospital");
      }
      res.json({
        success: true,
        message: "Hospital berhasil dihapus"
      });
    });
  }
}

module.exports = new HospitalController();