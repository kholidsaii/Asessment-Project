const db = require("../config/database"); // Menggunakan pool mysql2
const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

class UserController {
  // Ambil semua data user
  index(req, res) {
    User.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal ambil data user");
      res.json({
        success: true,
        message: "Berhasil ambil semua data user",
        data: results
      });
    });
  }

  // Tambah user baru (Register)
  store(req, res) {
    const data = req.body;
    User.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal tambah user");
      res.status(201).json({success:true, message: "User berhasil ditambahkan", data: { id: result.insertId, ...data } });
    });
  }

  // Fungsi Login (Wajib di dalam kurung kurawal UserController)
  login(req, res) {
    const { email, password } = req.body;
    User.getByEmail(email, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Error Database");
      if (results.length === 0) return errorHandler(res, "Email atau password salah", 401,"Email atau Password salah");

      const user = results[0];
      if (password !== user.password) return errorHandler(res, "Email atau password salah", 401, "Email atau Password salah");

      res.json({ success: true, message: "Login berhasil!", data: { id: user.id, name: user.name, email: user.email } });
    });
  }

  // Hapus user
  destroy(req, res) {
    const { id } = req.params;
    User.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500, "Gagal hapus user");
      res.json({success: true, message: "User berhasil dihapus" });
    });
  }
}

module.exports = new UserController();