const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Menjadi ini (Tambahkan __internal):
const prisma = new PrismaClient({
  __internal: {
    configOverride: (config) => config,
  },
});
const apiRoutes = require('./src/routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// Masukkan prisma ke req supaya bisa dipake di semua controller tanpa import ulang
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Prefix /api biar cocok sama Vue kamu
app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Express Watsar nyala di http://localhost:${PORT}`);
});