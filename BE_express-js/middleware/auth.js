const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

  if (!token) {
    return res.status(403).json({ 
      success: false, 
      message: "Akses ditolak, token tidak ditemukan!" 
    });
  }

  try {
    // Verifikasi token pakai Secret Key yang sama dengan di UserController
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY_NISA_123");
    req.user = decoded; // Simpan data user ke request agar bisa dipakai di controller
    next(); // Lanjut ke proses berikutnya
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "Token tidak valid atau sudah kadaluwarsa!" 
    });
  }
};

module.exports = verifyToken;