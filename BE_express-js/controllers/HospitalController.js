const Hospital = require("../models/Hospitals");
const errorHandler = require("../utils/errorHandler");
const { validateHospital } = require("../utils/validator");

class HospitalController {

  index(req, res) {
    Hospital.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal ambil data");

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
    });
  }

  show(req, res) {
    const { id } = req.params;

    Hospital.getById(id, (err, results) => {
      if (err) return errorHandler(res, err, 500);

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
    });
  }

  store(req, res) {
    const data = req.body;

    const { isValid, errors } = validateHospital(data);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors
      });
    }

    Hospital.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500);

      res.status(201).json({
        success: true,
        message: "Hospital berhasil ditambahkan",
        data: { id: result.insertId, ...data }
      });
    });
  }

  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    const { isValid, errors } = validateHospital(data);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors
      });
    }

    Hospital.update(id, data, (err) => {
      if (err) return errorHandler(res, err, 500);

      res.json({
        success: true,
        message: "Hospital berhasil diupdate"
      });
    });
  }

  destroy(req, res) {
    const { id } = req.params;

    Hospital.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500);

      res.json({
        success: true,
        message: "Hospital berhasil dihapus"
      });
    });
  }
}

module.exports = new HospitalController();