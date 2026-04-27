const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRegister, validateLogin } = require("../utils/authValidator");
const errorHandler = require("../utils/errorHandler");

class AuthController {

  register(req, res) {
    const data = req.body;

    const error = validateRegister(data);
    if (error) return errorHandler(res, error, 400, error);

    User.getByEmail(data.email, async (err, results) => {
      if (err) return errorHandler(res, err);

      if (results.length > 0) {
        return errorHandler(res, "Email sudah terdaftar", 400);
      }

      const hashed = await bcrypt.hash(data.password, 10);

      User.create({
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role || "user"
      }, (err) => {
        if (err) return errorHandler(res, err);

        res.status(201).json({
          success: true,
          message: "Register berhasil"
        });
      });
    });
  }

  login(req, res) {
    const data = req.body;

    const error = validateLogin(data);
    if (error) return errorHandler(res, error, 400, error);

    User.getByEmail(data.email, async (err, results) => {
      if (err) return errorHandler(res, err);

      if (results.length === 0) {
        return errorHandler(res, "User tidak ditemukan", 404);
      }

      const user = results[0];

      const match = await bcrypt.compare(data.password, user.password);
      if (!match) {
        return errorHandler(res, "Password salah", 401);
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        message: "Login berhasil",
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  }
}

module.exports = new AuthController();