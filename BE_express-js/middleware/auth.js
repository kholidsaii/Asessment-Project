const jwt = require('jsonwebtoken');

const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ success: false, message: "Token tidak ditemukan!" });
    }

    try {
      // Ambil secret dari .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Logika pembatasan ROLE
      // Jika roles diisi (misal: ['admin']), cek apakah role user cocok
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(401).json({ 
          success: false, 
          message: `Akses ditolak! Akun Anda (${decoded.role}) tidak punya izin.` 
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token tidak valid atau sudah kadaluwarsa!" });
    }
  };
};

module.exports = verifyToken;