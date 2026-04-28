const Category = require("../models/Category");
const errorHandler = require("../utils/errorHandler");

class CategoryController {
  // Mengambil semua kategori
  index(req, res) {
    Category.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal mengambil kategori");
      res.json({
        success: true,
        message: "Daftar kategori berhasil diambil",
        data: results
      });
    });
  }

  // Menambah kategori baru (Admin Only)
  store(req, res) {
    const data = req.body; // { name: "Umum" }
    
    if (!data.name) {
      return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
    }

    Category.create(data, (err, result) => {
      if (err) return errorHandler(res, err, 500);
      res.status(201).json({
        success: true,
        message: "Kategori berhasil ditambahkan",
        data: { id: result.insertId, ...data }
      });
    });
  }
}

module.exports = new CategoryController();