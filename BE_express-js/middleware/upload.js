const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 
  },
  filename: (req, file, cb) => {
    // Rename: timestamp + nama asli [cite: 209]
    cb(null, Date.now() + "-" + file.originalname); 
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Batasi 2MB [cite: 176, 233]
});

module.exports = upload;