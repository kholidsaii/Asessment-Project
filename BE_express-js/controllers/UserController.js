const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

class UserController {
  // Ambil semua data user
  index(req, res) {
    User.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal ambil data user");
      res.json({ message: "Berhasil ambil semua data user", data: results });
    });
  }

  // Tambah user baru (Register)
  store(req, res) {
    const data = req.body;
    User.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal tambah user");
      res.status(201).json({ message: "User berhasil ditambahkan", data: { id: result.insertId, ...data } });
    });
  }

  // Fungsi Login (Wajib di dalam kurung kurawal UserController)
  login(req, res) {
    const { email, password } = req.body;
    User.getByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ message: "Error Database" });
      if (results.length === 0) return res.status(401).json({ message: "Email atau Password salah" });

      const user = results[0];
      if (password !== user.password) return res.status(401).json({ message: "Email atau Password salah" });

      res.json({ message: "Login berhasil!", data: { id: user.id, name: user.name, email: user.email } });
    });
  }

  // Hapus user
  destroy(req, res) {
    const { id } = req.params;
    User.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500, "Gagal hapus user");
      res.json({ message: "User berhasil dihapus" });
    });
  }
}

module.exports = new UserController();