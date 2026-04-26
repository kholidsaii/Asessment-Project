require('dotenv').config();

const express = require("express");
const router = require("./routes/api");
const path = require("path"); // [1] Tambahkan modul path untuk handle direktori

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * [2] Static File Handling (Materi Pertemuan 7)
 * Membuat folder 'uploads' dapat diakses secara publik lewat URL.
 * Contoh: http://localhost:3000/uploads/nama-file.jpg
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 

// Routing
app.use("/api", router);

// Error handling sederhana jika route tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
    console.log("JWT Secret Status:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
    // [3] Opsional: Cek apakah folder static sudah siap
    console.log("Static files directory: /uploads");
});