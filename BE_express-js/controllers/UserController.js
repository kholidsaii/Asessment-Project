// controllers/UserController.js
const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");
const { validateUser } = require("../utils/validator");
const jwt = require("jsonwebtoken");

class UserController {
  // 1. Ambil semua data user (Async version)
  async index(req, res) {
    try {
      const results = await User.getAll();
      res.json({
        success: true,
        message: "Berhasil ambil semua data user",
        data: results
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil data user");
    }
  }

  // 2. Register User dengan Validasi
  async store(req, res) {
    try {
      const data = req.body;
      
      // Jalankan Validasi
      const { isValid, errors } = validateUser(data);
      if (!isValid) {
        return res.status(400).json({ success: false, message: "Validasi gagal", errors });
      }

      const result = await User.create(data);
      res.status(201).json({
        success: true, 
        message: "User berhasil ditambahkan", 
        data: { id: result.insertId, name: data.name, email: data.email, role: data.role || 'user' } 
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah user");
    }
  }

  // 3. Login dengan JWT
  async login(req, res) {
    try {
      const data = req.body;

      // Gunakan validator khusus login jika ada, atau pastikan email & password diisi
      if (!data.email || !data.password) {
        return res.status(400).json({ success: false, message: "Email dan Password wajib diisi" });
      }

      const results = await User.getByEmail(data.email);
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: "Email atau password salah" });
      }

      const user = results[0];

      // Cek Password (Plain Text)
      if (data.password !== user.password) {
        return res.status(401).json({ success: false, message: "Email atau password salah" });
      }

      // Buat Token JWT menggunakan Secret dari .env
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role || 'user' },
        process.env.JWT_SECRET || "SECRET_KEY_DEFAULT_KLO_ENV_GA_ADA", 
        { expiresIn: "1h" }
      );

      res.json({ 
        success: true, 
        message: "Login berhasil!", 
        token: token, 
        data: { id: user.id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Terjadi kesalahan pada server saat login");
    }
  }

  // 4. Hapus user
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await User.delete(id);
      res.json({ success: true, message: "User berhasil dihapus" });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal hapus user");
    }
  }
}

module.exports = new UserController();