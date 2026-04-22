const db = require("../config/db"); // Menggunakan pool mysql2
const errorHandler = require("../utils/errorHandler");
const { validateHospital } = require("../utils/validator");

class HospitalController {
  // 1. Ambil Semua Data (SELECT *)
  async index(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM hospitals");
      
      if (rows.length === 0) {
        return res.status(404).json({ message: "Data hospital kosong" });
      }

      res.json({
        message: "Berhasil ambil semua data hospital (Native SQL)",
        data: rows
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil data hospital");
    }
  }

  // 2. Dashboard Statistik (COUNT)
  async getStats(req, res) {
    try {
      // Kita jalankan query COUNT secara manual untuk masing-masing tabel
      const [hRes] = await db.query("SELECT COUNT(*) as total FROM hospitals");
      const [uRes] = await db.query("SELECT COUNT(*) as total FROM users");
      const [iRes] = await db.query("SELECT COUNT(*) as total FROM indicators");

      res.json({
        success: true,
        data: {
          totalHospitals: hRes[0].total,
          totalUsers: uRes[0].total,
          totalIndicators: iRes[0].total,
          totalAssessments: 0 // Sesuaikan jika tabel assessment sudah ada
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Gagal menghitung statistik", error: err.message });
    }
  }

  // 3. Detail Data (SELECT WHERE ID)
  async show(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query("SELECT * FROM hospitals WHERE id = ?", [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Hospital tidak ditemukan" });
      }

      res.json({
        message: "Detail hospital",
        data: rows[0]
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil detail hospital");
    }
  }

  // 4. Simpan Data (INSERT)
  async store(req, res) {
    try {
      const data = req.body;
      const { isValid, errors } = validateHospital(data);

      if (!isValid) {
        return res.status(400).json({ message: "Validasi input gagal", errors });
      }

      const sql = "INSERT INTO hospitals (name, code, class, address) VALUES (?, ?, ?, ?)";
      const [result] = await db.execute(sql, [data.name, data.code, data.class, data.address]);

      res.status(201).json({
        message: "Hospital berhasil ditambahkan",
        data: { id: result.insertId, ...data }
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah hospital");
    }
  }

  // 5. Update Data (UPDATE WHERE ID)
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const { isValid, errors } = validateHospital(data);

      if (!isValid) {
        return res.status(400).json({ message: "Validasi input gagal", errors });
      }

      const sql = "UPDATE hospitals SET name = ?, code = ?, class = ?, address = ? WHERE id = ?";
      await db.execute(sql, [data.name, data.code, data.class, data.address, id]);

      res.json({
        message: "Hospital berhasil diupdate",
        data: { id, ...data }
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal update hospital");
    }
  }

  // 6. Hapus Data (DELETE)
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await db.execute("DELETE FROM hospitals WHERE id = ?", [id]);

      res.json({ message: "Hospital berhasil dihapus" });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal hapus hospital");
    }
  }
}

module.exports = new HospitalController();