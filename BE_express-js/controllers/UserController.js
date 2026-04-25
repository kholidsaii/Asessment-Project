const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");
const { validateUser } = require("../utils/validator"); // Memanggil validator kamu
const jwt = require("jsonwebtoken"); // Tambahkan ini (Pastikan sudah npm install jsonwebtoken)

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

  // Tambah user baru (Register) dengan VALIDASI
  store(req, res) {
    const data = req.body;
    
    // SPRINT 6: Jalankan Validasi Input
    const { isValid, errors } = validateUser(data);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Validasi gagal", errors });
    }

    User.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal tambah user");
      res.status(201).json({
        success: true, 
        message: "User berhasil ditambahkan", 
        data: { id: result.insertId, ...data } 
      });
    });
  }

  // Fungsi Login dengan VALIDASI & TOKEN (JWT)
  login(req, res) {
    const data = req.body;

    // SPRINT 6: Jalankan Validasi Input Login
    const { isValid, errors } = validateUser(data);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Validasi gagal", errors });
    }

    User.getByEmail(data.email, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Error Database");
      if (results.length === 0) return res.status(401).json({ success: false, message: "Email atau password salah" });

      const user = results[0];

      // Cek Password (disini masih plain text sesuai kodingan kamu)
      if (data.password !== user.password) {
        return res.status(401).json({ success: false, message: "Email atau password salah" });
      }

      // SPRINT 6: Buat Token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role || 'user' },
        "SECRET_KEY_NISA_123", // Ini secret key kamu
        { expiresIn: "1h" }
      );

      res.json({ 
        success: true, 
        message: "Login berhasil!", 
        token: token, // Token ini yang akan di-test di Postman
        data: { id: user.id, name: user.name, email: user.email } 
      });
    });
  }

  // Hapus user
  destroy(req, res) {
    const { id } = req.params;
    User.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500, "Gagal hapus user");
      res.json({ success: true, message: "User berhasil dihapus" });
    });
  }
}

module.exports = new UserController();