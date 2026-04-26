require('dotenv').config();

const express = require("express");
const router = require("./routes/api");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Tambahkan { extended: true } agar tidak deprecated

// Routing
app.use("/api", router);

// Error handling sederhana jika route tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
    // Opsional: Cek apakah .env terbaca
    console.log("JWT Secret Status:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
});