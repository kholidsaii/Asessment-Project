const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const apiRoutes = require('./src/routes/api'); // Memanggil file yang tadi di-rename

const app = express();

app.use(cors());
app.use(express.json());

// "Inject" prisma ke request biar bisa dipake di route manapun
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});