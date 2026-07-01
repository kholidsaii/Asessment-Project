# Assessment Rumah Sakit - Fullstack Web Application

Assessment Rumah Sakit adalah aplikasi web fullstack yang digunakan untuk membantu proses penilaian mutu layanan/fasilitas rumah sakit. Sistem ini memiliki dua role utama, yaitu **Admin** dan **User Rumah Sakit**. Admin dapat mengelola data master seperti rumah sakit, indikator, pertanyaan assessment, dan user. User rumah sakit dapat mengisi assessment berdasarkan pertanyaan yang telah dibuat admin, kemudian hasilnya dapat dilihat dalam bentuk rekap dan visualisasi dashboard.

---

## 1. Gambaran Umum Sistem

Aplikasi ini dibuat untuk mendukung proses self-assessment rumah sakit secara digital. Admin menyiapkan indikator dan pertanyaan assessment, kemudian user rumah sakit mengisi penilaian berdasarkan pertanyaan tersebut. Hasil penilaian akan tersimpan di database dan ditampilkan melalui dashboard statistik, grafik, aktivitas terbaru, serta laporan rekap.

Alur utama sistem:

```txt
Admin membuat indikator
        ↓
Admin membuat pertanyaan berdasarkan indikator
        ↓
User rumah sakit mengisi assessment
        ↓
Data penilaian tersimpan di database
        ↓
Dashboard dan laporan menampilkan hasil penilaian
```

---

## 2. Role Pengguna

### Admin

Admin memiliki hak akses untuk:

- Melihat dashboard statistik seluruh sistem.
- Melihat grafik rata-rata skor per indikator.
- Melihat ranking rumah sakit berdasarkan hasil assessment.
- Melihat tren aktivitas penilaian.
- Melihat aktivitas terbaru dari rumah sakit.
- Mengelola data indikator.
- Mengelola data pertanyaan assessment.
- Melihat data rumah sakit.
- Melihat data user/admin.

### User Rumah Sakit

User rumah sakit memiliki hak akses untuk:

- Melihat dashboard khusus rumah sakitnya.
- Melihat progress pengisian assessment.
- Mengisi assessment berdasarkan indikator dan pertanyaan.
- Mengunggah bukti pendukung assessment.
- Melihat laporan rekap hasil assessment.
- Melihat rata-rata skor dan status mutu.

---

## 3. Teknologi yang Digunakan

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs
- multer
- dotenv
- cors

### Database

- MySQL
- phpMyAdmin / XAMPP

---

## 4. Struktur Database Final

Database final menggunakan struktur yang sederhana dan tidak lagi memakai tabel `categories` agar tidak terjadi duplikasi konsep.

Tabel utama:

```txt
hospitals
users
indicators
questions
assessments
```

### Konsep Relasi

```txt
indicators  = jenis layanan/fasilitas/indikator rumah sakit
questions   = pertanyaan assessment berdasarkan indicator_id
assessments = jawaban/skor rumah sakit berdasarkan question_id
```

Relasi utama:

```txt
hospitals.id      → users.hospital_id
indicators.id    → questions.indicator_id
hospitals.id      → assessments.hospital_id
questions.id      → assessments.question_id
```

---

## 5. Fitur Utama

### Authentication

- Register user.
- Login user/admin.
- Password terenkripsi menggunakan bcryptjs.
- Token login menggunakan JWT.
- Role-based access antara admin dan user rumah sakit.

### Dashboard Admin

Dashboard admin menampilkan:

- Total rumah sakit.
- Total user.
- Total indikator.
- Total assessment yang sudah masuk.
- Jumlah rumah sakit yang sudah dinilai.
- Rata-rata skor assessment.
- Grafik rata-rata skor per indikator.
- Grafik ranking rumah sakit.
- Grafik tren aktivitas penilaian.
- Aktivitas terbaru.

### Dashboard User Rumah Sakit

Dashboard user menampilkan:

- Total pertanyaan assessment.
- Jumlah pertanyaan yang sudah dinilai.
- Jumlah indikator yang sudah dinilai.
- Rata-rata skor rumah sakit.
- Progress pengisian assessment.
- Status mutu.
- Grafik skor per indikator.
- Grafik progress pengisian.

### Indikator

Admin dapat mengelola data indikator, yaitu jenis layanan/fasilitas yang akan dinilai.

Contoh indikator:

- Pelayanan Medis
- IGD
- Farmasi
- Fasilitas Rawat Inap
- Administrasi

Fitur indikator:

- Menampilkan daftar indikator.
- Menambahkan indikator.
- Mengedit indikator.
- Menghapus indikator.

### Pertanyaan Assessment

Admin dapat mengelola pertanyaan assessment yang terhubung dengan indikator tertentu.

Contoh:

```txt
Indikator: Pelayanan Medis
Pertanyaan: Apakah rumah sakit memiliki SOP pelayanan medis yang terdokumentasi?
```

Fitur pertanyaan:

- Menampilkan daftar pertanyaan.
- Menambahkan pertanyaan.
- Memilih indikator untuk pertanyaan.
- Mengedit pertanyaan.
- Menghapus pertanyaan.

### Input Assessment

User rumah sakit dapat:

- Memilih indikator.
- Melihat daftar pertanyaan berdasarkan indikator.
- Mengisi skor penilaian.
- Mengunggah bukti pendukung.
- Menyimpan hasil penilaian.

Skor assessment:

```txt
0  = Belum Memenuhi
5  = Sebagian Memenuhi
10 = Memenuhi
```

### Laporan Rekap

Halaman laporan rekap menampilkan:

- Nama rumah sakit.
- Total pertanyaan yang sudah dinilai.
- Total pertanyaan keseluruhan.
- Progress pengisian.
- Rata-rata skor mutu.
- Status mutu.
- Hasil evaluasi mutu per indikator.

Status mutu ditentukan berdasarkan rata-rata skor:

```txt
>= 8  = Sangat Baik
>= 6  = Baik
>= 4  = Cukup
< 4   = Perlu Perbaikan
```

---

## 6. Struktur Folder Project

```txt
Asessment-Project
│
├── BE_express-js
│   ├── config
│   │   └── database.js
│   ├── controllers
│   │   ├── AssessmentController.js
│   │   ├── AuthController.js
│   │   ├── HospitalController.js
│   │   ├── IndicatorController.js
│   │   ├── QuestionController.js
│   │   └── UserController.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   └── upload.js
│   ├── models
│   │   ├── Assessment.js
│   │   ├── Hospitals.js
│   │   ├── Indicator.js
│   │   ├── Question.js
│   │   └── User.js
│   ├── routes
│   │   └── api.js
│   ├── uploads
│   ├── utils
│   │   ├── authValidator.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── ActivitySection
│   │   │   ├── DashboardCharts
│   │   │   ├── DashboardHeader
│   │   │   ├── HospitalTable
│   │   │   ├── IndicatorTable
│   │   │   ├── PatientTable
│   │   │   ├── Sidebar
│   │   │   ├── StatCard
│   │   │   └── StatsSection
│   │   ├── pages
│   │   │   ├── AssessmentPage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── HospitalPage.jsx
│   │   │   ├── IndicatorFormPage.jsx
│   │   │   ├── IndicatorPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PatientPage.jsx
│   │   │   ├── QuestionPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ReportPage.jsx
│   │   ├── utils
│   │   │   └── constant
│   │   │       └── http.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── database
│   └── hospital_db_FINAL_FIX_ONE_FILE.sql
│
└── README.md
```

---

## 7. Instalasi dan Menjalankan Project

### 7.1 Persiapan

Pastikan sudah terinstall:

- Node.js
- npm
- XAMPP
- MySQL
- phpMyAdmin

---

### 7.2 Import Database

1. Jalankan XAMPP.
2. Aktifkan Apache dan MySQL.
3. Buka phpMyAdmin.
4. Import file SQL final:

```txt
database/hospital_db_FINAL_FIX_ONE_FILE.sql
```

Database yang digunakan:

```txt
hospital_db
```

Setelah import berhasil, pastikan tabel berikut tersedia:

```txt
hospitals
users
indicators
questions
assessments
```

---

### 7.3 Konfigurasi Backend

Buka file:

```txt
BE_express-js/.env
```

Isi dengan konfigurasi berikut:

```env
DATABASE_URL="mysql://root:@localhost:3306/hospital_db"

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=hospital_db
JWT_SECRET=rahasia_jwt_fullstack
PORT=3000
```

Catatan:

- Pastikan `DB_NAME` sama dengan nama database yang di-import.
- Jika password MySQL kamu tidak kosong, isi bagian `DB_PASS`.

---

### 7.4 Menjalankan Backend

Masuk ke folder backend:

```bash
cd BE_express-js
npm install
npm run dev
```

Jika berhasil, backend berjalan pada:

```txt
http://localhost:3000
```

---

### 7.5 Menjalankan Frontend

Buka terminal baru, lalu masuk ke folder frontend:

```bash
cd frontend
npm install
npm install recharts
npm run dev
```

Jika berhasil, frontend berjalan pada:

```txt
http://localhost:5173
```

---

## 8. Akun Demo

### Admin

```txt
Email    : admin@rs.com
Password : admin123
```

### User Rumah Sakit

```txt
Email    : user@rs.com
Password : user123
```

User rumah sakit sudah terhubung ke data rumah sakit melalui `hospital_id`, sehingga dapat langsung digunakan untuk mengisi assessment dan melihat laporan rekap.

---

## 9. Endpoint API Utama

Base URL backend:

```txt
http://localhost:3000/api
```

### Auth

```txt
POST /register
POST /login
```

### Hospitals

```txt
GET    /hospitals
GET    /hospitals/:id
POST   /hospitals
PUT    /hospitals/:id
DELETE /hospitals/:id
GET    /hospitals/stats
```

### Indicators

```txt
GET    /indicators
GET    /indicators/:id
POST   /indicators
PUT    /indicators/:id
DELETE /indicators/:id
```

### Questions

```txt
GET    /questions
GET    /questions/:id
GET    /questions?indicator_id=1
POST   /questions
PUT    /questions/:id
DELETE /questions/:id
```

### Assessments

```txt
POST /assessments
GET  /assessments/recent
GET  /assessments/report/:hospital_id
```

### Dashboard Charts

```txt
GET /dashboard/admin/charts
GET /dashboard/user/charts/:hospital_id
```

---

## 10. Alur Demo Aplikasi

### 10.1 Demo Admin

1. Login sebagai admin.
2. Buka dashboard.
3. Tunjukkan statistik utama.
4. Tunjukkan grafik dashboard admin.
5. Tunjukkan aktivitas terbaru.
6. Masuk menu Indikator.
7. Tambahkan/edit indikator.
8. Masuk menu Pertanyaan.
9. Tambahkan pertanyaan dan hubungkan dengan indikator.
10. Tunjukkan data rumah sakit dan user.

### 10.2 Demo User Rumah Sakit

1. Login sebagai user rumah sakit.
2. Buka dashboard user.
3. Tunjukkan progress assessment.
4. Masuk menu Input Assessment.
5. Pilih indikator.
6. Isi skor pertanyaan.
7. Upload bukti jika diperlukan.
8. Simpan assessment.
9. Masuk menu Laporan Rekap.
10. Tunjukkan hasil rekap dan evaluasi mutu.

### 10.3 Demo Kembali ke Admin

1. Login kembali sebagai admin.
2. Buka dashboard.
3. Tunjukkan aktivitas terbaru yang bertambah setelah user mengisi assessment.
4. Tunjukkan grafik yang berubah mengikuti data assessment.

---

## 11. Penjelasan Konsep untuk Presentasi

Penjelasan singkat:

> Sistem Assessment Rumah Sakit ini dibuat untuk membantu proses self-assessment mutu layanan rumah sakit secara digital. Admin dapat mengelola indikator layanan atau fasilitas, kemudian membuat pertanyaan assessment berdasarkan indikator tersebut. User rumah sakit dapat mengisi penilaian dengan skor 0, 5, atau 10 serta mengunggah bukti pendukung. Data yang masuk akan ditampilkan dalam dashboard admin dan user melalui statistik, grafik, aktivitas terbaru, dan laporan rekap.

Penjelasan database:

> Struktur database dibuat sederhana agar tidak ada data yang duplikat. Tabel `indicators` digunakan sebagai master layanan atau fasilitas yang dinilai. Tabel `questions` menyimpan pertanyaan assessment yang terhubung ke indikator. Tabel `assessments` menyimpan jawaban atau skor yang diberikan oleh rumah sakit.

Penjelasan dashboard:

> Dashboard admin menampilkan gambaran keseluruhan sistem, seperti total rumah sakit, user, indikator, total penilaian, grafik skor per indikator, ranking rumah sakit, tren penilaian, dan aktivitas terbaru. Dashboard user menampilkan progress pengisian assessment rumah sakit tersebut, skor per indikator, serta status mutu.

---

## 12. Troubleshooting

### 12.1 Login gagal dengan Internal Server Error

Penyebab umum:

- Database belum di-import.
- `.env` masih menggunakan database lama.
- `JWT_SECRET` kosong.
- Tabel `users` belum sesuai.

Solusi:

```env
DB_NAME=hospital_db
JWT_SECRET=rahasia_jwt_fullstack
```

Lalu restart backend:

```bash
npm run dev
```

---

### 12.2 Frontend muncul ECONNREFUSED

Penyebab:

- Backend belum berjalan.
- Proxy frontend mengarah ke port yang salah.

Solusi:

Jalankan backend:

```bash
cd BE_express-js
npm run dev
```

Pastikan `frontend/vite.config.js` mengarah ke:

```js
target: "http://localhost:3000"
```

---

### 12.3 Token tidak ditemukan

Penyebab:

- Endpoint yang membutuhkan login diakses langsung dari browser tanpa token.
- User belum login.
- Token belum tersimpan di localStorage.

Solusi:

- Login melalui aplikasi terlebih dahulu.
- Pastikan request Axios mengirim token.
- Cek `frontend/src/utils/constant/http.jsx`.

---

### 12.4 Dashboard kosong

Penyebab:

- Data assessment belum ada.
- User belum mengisi assessment.

Solusi:

1. Login sebagai user rumah sakit.
2. Isi assessment.
3. Simpan skor.
4. Login sebagai admin.
5. Refresh dashboard.

---

### 12.5 Grafik tidak muncul

Penyebab:

- Library Recharts belum terinstall.

Solusi:

```bash
cd frontend
npm install recharts
npm run dev
```

---

### 12.6 Halaman Pertanyaan gagal mengambil data

Penyebab umum:

- Database masih memakai struktur lama dengan `categories`.
- Kode frontend/backend belum sinkron dengan database final.

Solusi:

Pastikan database final hanya memakai:

```txt
hospitals
users
indicators
questions
assessments
```

Dan pastikan tabel `questions` memiliki kolom:

```txt
id
indicator_id
question_text
created_at
updated_at
```

---

## 13. Catatan Pengembangan Lanjutan

Beberapa fitur yang dapat dikembangkan ke depannya:

- CRUD rumah sakit secara penuh dari frontend.
- CRUD user dengan pilihan role dan hospital_id.
- Export laporan assessment ke PDF.
- Filter dashboard berdasarkan periode waktu.
- Upload bukti assessment dengan preview gambar.
- Notifikasi ketika rumah sakit menyelesaikan assessment.
- Role tambahan untuk reviewer/verifikator.
- Validasi assessment oleh admin.

---

## 14. Status Project

Status akhir project:

```txt
Login/Register                : Selesai
Role Admin/User               : Selesai
Dashboard Admin               : Selesai
Dashboard User                : Selesai
CRUD Indikator                : Selesai
CRUD Pertanyaan               : Selesai
Input Assessment              : Selesai
Upload Bukti                  : Selesai
Laporan Rekap                 : Selesai
Grafik Dashboard              : Selesai
Aktivitas Terbaru             : Selesai
Database Final Tanpa Duplikat : Selesai
```

---

## 15. Tim Pengembang

Project ini dikembangkan sebagai tugas akhir mata kuliah Fullstack Development.

Pembagian umum pengembangan:

- Scrum Master: Azkia
- Backend: Express.js dan MySQL
- Frontend: React.js dan Tailwind CSS
- Database: MySQL
- Integrasi: Frontend, backend, authentication, assessment, dashboard, dan laporan

---

## 16. Kesimpulan

Aplikasi Assessment Rumah Sakit ini telah menerapkan konsep fullstack development dengan integrasi frontend React.js, backend Express.js, dan database MySQL. Sistem sudah mendukung autentikasi pengguna, role-based access, pengelolaan indikator dan pertanyaan, input assessment, dashboard statistik, grafik visual, aktivitas terbaru, serta laporan rekap hasil penilaian.
