const prisma = require("../config/prisma");
const errorHandler = require("../utils/errorHandler");
const { validateHospital } = require("../utils/validator");


class HospitalController {
  // Ambil Semua Data
  async index(req, res) {
    try {
      const results = await prisma.hospitals.findMany(); // 'hospitals' sesuai nama tabel di DB
      
      if (results.length === 0) {
        return res.status(404).json({ message: "Data hospital kosong" });
      }

      res.json({
        message: "Berhasil ambil semua data hospital",
        data: results
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil data hospital");
    }
  }
  async getStats(req, res) {
    try {
      // Kita hitung isi tabel secara paralel agar cepat
      const [hospitals, users, indicators] = await Promise.all([
        prisma.hospitals.count(),
        prisma.users.count(),
        prisma.indicators.count()
      ]);

      res.json({
        success: true,
        data: {
          totalHospitals: hospitals,
          totalUsers: users,
          totalIndicators: indicators,
          totalAssessments: 45 // Kamu bisa ganti prisma.assessments.count() jika sudah ada datanya
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Gagal menghitung statistik", error: err.message });
    }
  }
  // Detail Data
  async show(req, res) {
    try {
      const { id } = req.params;
      const hospital = await prisma.hospitals.findUnique({
        where: { id: parseInt(id) }
      });

      if (!hospital) {
        return res.status(404).json({ message: "Hospital tidak ditemukan" });
      }

      res.json({
        message: "Detail hospital",
        data: hospital
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal ambil detail hospital");
    }
  }

  // Simpan Data (Create)
  async store(req, res) {
    try {
      const data = req.body;
      const { isValid, errors } = validateHospital(data);

      if (!isValid) {
        return res.status(400).json({ message: "Validasi input gagal", errors });
      }

      const newHospital = await prisma.hospitals.create({
        data: {
          name: data.name,
          code: data.code,
          class: data.class,
          address: data.address
        }
      });

      res.status(201).json({
        message: "Hospital berhasil ditambahkan",
        data: newHospital
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah hospital");
    }
  }

  // Update Data
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const { isValid, errors } = validateHospital(data);

      if (!isValid) {
        return res.status(400).json({ message: "Validasi input gagal", errors });
      }

      const updated = await prisma.hospitals.update({
        where: { id: parseInt(id) },
        data: data
      });

      res.json({
        message: "Hospital berhasil diupdate",
        data: updated
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal update hospital");
    }
  }

  // Hapus Data
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await prisma.hospitals.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: "Hospital berhasil dihapus" });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal hapus hospital");
    }
  }

  // Tambahan untuk Dashboard: Hitung Statistik
  async getStats(req, res) {
    try {
      const [hospitals, users, indicators] = await Promise.all([
        prisma.hospitals.count(),
        prisma.users.count(),
        prisma.indicators.count()
      ]);

      res.json({
        hospitals,
        users,
        indicators
      });
    } catch (err) {
      res.status(500).json({ message: "Gagal ambil statistik" });
    }
  }
}

module.exports = new HospitalController();