# SIMRS Dev - Sistem Informasi Manajemen Rumah Sakit

Aplikasi manajemen rumah sakit berbasis Fullstack JavaScript menggunakan **React (Vite)** untuk Frontend, **Express.js** untuk Backend, dan **Prisma ORM** dengan database **MySQL**.

##  Fitur Utama
- **Dashboard Dinamis**: Statistik real-time (Total RS, User, Indikator).
- **Manajemen Rumah Sakit**: CRUD data rumah sakit dengan validasi.
- **Indikator Medis**: Pengelolaan parameter penilaian medis.
- **Daftar Pasien**: Manajemen data pengguna dan pasien.
- **UI Modern**: Menggunakan Tailwind CSS dan Lucide Icons.

---

## Persiapan Lingkungan
Sebelum menjalankan aplikasi, pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Rekomendasi v18 ke atas)
- [XAMPP](https://www.apachefriends.org/) atau MySQL Server
- Git

---

## Cara Instalasi

### 1. Clone Repository
```bash
git clone [https://github.com/kholidsaii/Asessment-Project/](https://github.com/kholidsaii/Asessment-Project.git)   
cd nama_repo

2. Konfigurasi Database
Jalankan MySQL (lewat XAMPP atau Docker).

Buat database baru di phpMyAdmin bernama hospital_db.

Import file hospital_db.sql (jika tersedia) atau gunakan Prisma Migrations nanti.

3. Setup Backend (Express & Prisma)
Bash
cd BE_express-js
npm install
Buat file .env di dalam folder BE_express-js:

Cuplikan kode
DATABASE_URL="mysql://root:@localhost:3306/hospital_db"
PORT=3000
Jalankan Prisma Generate:

Bash
npx prisma generate
4. Setup Frontend (React)
Bash
cd ../frontend
npm install
🏃 Cara Menjalankan
Menjalankan Backend
Buka terminal baru di folder BE_express-js:

Bash
node index.js
# atau jika ada nodemon:
npm run dev
Server akan berjalan di: http://localhost:3000

Menjalankan Frontend
Buka terminal baru di folder frontend:

Bash
npm run dev
Aplikasi dapat diakses di: http://localhost:5173

📂 Struktur Folder
BE_express-js/: API Server & Konfigurasi Prisma.

frontend/: Dashboard React & Tailwind UI.

prisma/: Schema database.

👤 Author
Kholid Saifullah - Fullstack Developer


---

### Tips untuk Push:
1. Pastikan file ini ditaruh di folder paling luar.
2. Gunakan pesan commit: `git commit -m "docs: add README with installation guide"`
