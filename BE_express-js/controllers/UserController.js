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