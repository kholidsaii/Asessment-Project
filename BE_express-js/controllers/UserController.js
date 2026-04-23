const db = require("../config/database"); // Menggunakan pool mysql2
const errorHandler = require("../utils/errorHandler");

class UserController {
  // 1. Ambil semua data user
  async index(req, res) {
    try {
      const [rows] = await db.query("SELECT id, name, email, role FROM users");
      
      if (rows.length === 0) {
        return res.status(404).json({ message: "Data user kosong" });
      }

      res.json({ 
        success: true,
        message: "Berhasil ambil semua data user", 
        data: rows 
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil data user");
    }
  }

  // 2. Tambah user baru (Register / Tambah Pasien)
  async store(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Validasi sederhana jika field kosong
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Nama, Email, dan Password wajib diisi" });
      }

      const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
      const [result] = await db.execute(sql, [name, email, password, role || 'patient']);

      res.status(201).json({ 
        success: true,
        message: "User berhasil ditambahkan", 
        data: { id: result.insertId, name, email, role: role || 'patient' } 
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah user");
    }
  }

  // 3. Fungsi Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email dan Password wajib diisi" });
      }

      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Email atau Password salah" });
      }

      const user = rows[0];

      // Cek password (masih plain text sesuai kode lamamu)
      if (password !== user.password) {
        return res.status(401).json({ message: "Email atau Password salah" });
      }

      res.json({ 
        success: true,
        message: "Login berhasil!", 
        data: { id: user.id, name: user.name, email: user.email, role: user.role } 
      });
    } catch (err) {
      return res.status(500).json({ message: "Error Database", error: err.message });
    }
  }

  // 4. Hapus user
  async destroy(req, res) {
    try {
      const { id } = req.params;
      
      await db.execute("DELETE FROM users WHERE id = ?", [id]);

      res.json({ 
        success: true,
        message: "User berhasil dihapus" 
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal hapus user");
    }
  }
}

module.exports = new UserController();