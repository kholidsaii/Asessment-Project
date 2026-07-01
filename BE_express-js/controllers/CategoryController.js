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

  // MENGAMBIL 1 DATA SPESIFIK BERDASARKAN ID (Untuk Form Edit)
  show(req, res) {
    const { id } = req.params;
    
    Category.getById(id, (err, results) => {
      if (err) return errorHandler(res, err, 500);

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Kategori tidak ditemukan"
        });
      }

      res.json({
        success: true,
        message: "Detail kategori",
        data: results[0]
      });
    });
  }

  // Menambah kategori baru (Admin Only)
  store(req, res) {
    const data = req.body; 
    
    if (!data.name || !data.slug || !data.group) {
      return res.status(400).json({ success: false, message: "Nama, slug, dan group kategori wajib diisi" });
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

  // UPDATE KATEGORI (Saat menekan tombol Simpan di Edit)
  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    if (!data.name || !data.slug || !data.group) {
      return res.status(400).json({ success: false, message: "Nama, slug, dan group kategori wajib diisi" });
    }

    Category.update(id, data, (err) => {
      if (err) return errorHandler(res, err, 500);

      res.json({
        success: true,
        message: "Kategori berhasil diupdate"
      });
    });
  }

  // HAPUS KATEGORI
  destroy(req, res) {
    const { id } = req.params;

    Category.delete(id, (err) => {
      if (err) return errorHandler(res, err, 500);

      res.json({
        success: true,
        message: "Kategori berhasil dihapus"
      });
    });
  }
}

module.exports = new CategoryController();