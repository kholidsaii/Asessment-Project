const bcrypt = require("bcryptjs");
const User = require("../models/User");
const errorHandler = require("../utils/errorHandler");

const validRoles = ["admin", "user"];

class UserController {
  index(req, res) {
    User.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil data user");

      res.json({
        success: true,
        message: "Berhasil mengambil data user",
        data: results || [],
      });
    });
  }

  show(req, res) {
    const { id } = req.params;

    User.getById(id, (err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil detail user");

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Detail user berhasil diambil",
        data: results[0],
      });
    });
  }

  async store(req, res) {
    try {
      const { name, email, password, role = "user", hospital_id } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Nama, email, dan password wajib diisi",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password minimal 6 karakter",
        });
      }

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role hanya boleh admin atau user",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      User.create(
        {
          name,
          email,
          password: hashedPassword,
          role,
          hospital_id: role === "user" ? hospital_id || null : null,
        },
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                success: false,
                message: "Email sudah digunakan",
              });
            }

            return errorHandler(res, err, 500, "Gagal menambahkan user");
          }

          res.status(201).json({
            success: true,
            message: "User berhasil ditambahkan",
            data: {
              id: result.insertId,
              name,
              email,
              role,
              hospital_id: role === "user" ? hospital_id || null : null,
            },
          });
        }
      );
    } catch (err) {
      return errorHandler(res, err, 500, "Terjadi kesalahan saat menambahkan user");
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, role = "user", hospital_id } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Nama dan email wajib diisi",
        });
      }

      if (password && password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password minimal 6 karakter",
        });
      }

      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role hanya boleh admin atau user",
        });
      }

      const payload = {
        name,
        email,
        role,
        hospital_id: role === "user" ? hospital_id || null : null,
      };

      if (password) {
        payload.password = await bcrypt.hash(password, 10);
      }

      User.update(id, payload, (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              success: false,
              message: "Email sudah digunakan oleh user lain",
            });
          }

          return errorHandler(res, err, 500, "Gagal mengupdate user");
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "User tidak ditemukan",
          });
        }

        res.json({
          success: true,
          message: "User berhasil diupdate",
        });
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Terjadi kesalahan saat mengupdate user");
    }
  }

  destroy(req, res) {
    const { id } = req.params;

    if (req.user?.id && Number(req.user.id) === Number(id)) {
      return res.status(400).json({
        success: false,
        message: "Akun yang sedang login tidak boleh dihapus",
      });
    }

    User.delete(id, (err, result) => {
      if (err) return errorHandler(res, err, 500, "Gagal menghapus user");

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "User berhasil dihapus",
      });
    });
  }
}

module.exports = new UserController();
