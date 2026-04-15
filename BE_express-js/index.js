const express = require("express");
const cors = require("cors"); // 1. Tambahkan ini
const router = require("./routes/api");

const app = express();

// Middleware
app.use(cors()); // 2. Izinkan akses dari Frontend React (Vite)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Tambahkan parameter ini agar tidak warning

// Routing
// Sebaiknya pilih salah satu saja, standarnya menggunakan prefix /api
app.use("/api", router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});