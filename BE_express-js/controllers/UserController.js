const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

class UserController {
  index(req, res) {
    User.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500);

      res.json({
        success: true,
        message: "Berhasil ambil data user",
        data: results
      });
    });
  }

  // 1. TAMBAHKAN INI: Fungsi untuk mengambil 1 data spesifik (Get by ID)
  show(req, res) {
    const { id } = req.params;
    
    User.getById(id, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil data user");

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan"
        });
      }

      res.json({
        success: true,
        message: "Detail user",
        data: results[0]
      });
    });
  }

  // 2. TAMBAHKAN INI: Fungsi untuk menyimpan data baru
  store(req, res) {
    const data = req.body;

    // Validasi sederhana (Pastikan tidak kosong)
    if (!data.name || !data.email || !data.password) {
      return res.status(400).json({ 
        success: false, 
        message: "Nama, email, dan password wajib diisi" 
      });
    }

    User.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal membuat user");

      res.status(201).json({
        success: true,
        message: "User berhasil ditambahkan",
        // insertId akan mengembalikan ID yang baru saja dibuat di database
        data: { id: result.insertId, ...data } 
      });
    });
  }

  // 3. TAMBAHKAN INI: Fungsi untuk mengupdate data lama
  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    // Hapus properti password jika kosong agar tidak menimpa password lama di database
    if (!data.password || data.password.trim() === "") {
      delete data.password;
    }

    User.update(id, data, (err) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengupdate user");

      res.json({
        success: true,
        message: "User berhasil diupdate"
      });
    });
  }

  destroy(req, res) {
    const { id } = req.params;

    User.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500);

      res.json({
        success: true,
        message: "User berhasil dihapus"
      });
    });
  }
}

module.exports = new UserController();