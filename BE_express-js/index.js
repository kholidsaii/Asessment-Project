require('dotenv').config();

const express = require("express");
const router = require("./routes/api");
const path = require("path"); // [1] Tambahkan modul path untuk handle direktori
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 

// Routing
app.use("/api", router);

// Error handling sederhana jika route tidak ditemukan
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server berjalan di port ${process.env.PORT}`);
});