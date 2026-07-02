-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Jul 2026 pada 19.40
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simrs`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `assessments`
--

CREATE TABLE `assessments` (
  `id` int(11) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `assessments`
--

INSERT INTO `assessments` (`id`, `hospital_id`, `question_id`, `score`, `photo`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 10, NULL, '2026-07-01 16:21:51', '2026-07-01 16:21:51'),
(2, 1, 2, 5, NULL, '2026-07-01 16:31:51', '2026-07-01 16:31:51'),
(3, 1, 4, 10, NULL, '2026-07-01 16:41:51', '2026-07-01 16:41:51'),
(4, 1, 8, 5, NULL, '2026-07-01 16:51:51', '2026-07-01 16:51:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `hospitals`
--

CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `class` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `code`, `class`, `address`, `created_at`, `updated_at`) VALUES
(1, 'RS Contoh Sehat', 'RS001', 'A', 'Jakarta', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(2, 'RS Harapan Medika', 'RS002', 'B', 'Depok', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(3, 'RS Mitra Keluarga Demo', 'RS003', 'C', 'Bogor', '2026-07-01 16:56:51', '2026-07-01 16:56:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `indicators`
--

CREATE TABLE `indicators` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `indicators`
--

INSERT INTO `indicators` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Pelayanan Medis', 'Standar pelayanan medis dan tindakan klinis rumah sakit.', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(2, 'Fasilitas Rumah Sakit', 'Ketersediaan, kelayakan, dan keamanan fasilitas rumah sakit.', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(3, 'Administrasi', 'Kelengkapan administrasi, dokumentasi, dan pencatatan layanan.', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(4, 'Keselamatan Pasien', 'Prosedur keselamatan pasien dan pencegahan risiko layanan.', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(5, 'Sumber Daya Manusia', 'Ketersediaan dan kompetensi tenaga kesehatan serta staf pendukung.', '2026-07-01 16:56:51', '2026-07-01 16:56:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `indicator_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `questions`
--

INSERT INTO `questions` (`id`, `indicator_id`, `question_text`, `created_at`, `updated_at`) VALUES
(1, 1, 'Apakah rumah sakit memiliki SOP pelayanan medis yang terdokumentasi dan diterapkan?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(2, 1, 'Apakah tenaga medis tersedia sesuai kebutuhan pelayanan pasien?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(3, 1, 'Apakah pelayanan medis dilakukan sesuai standar mutu yang berlaku?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(4, 2, 'Apakah fasilitas utama rumah sakit dalam kondisi layak dan aman digunakan?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(5, 2, 'Apakah ruang pelayanan pasien memiliki sarana kebersihan dan keamanan yang memadai?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(6, 3, 'Apakah dokumen administrasi pelayanan tersimpan dengan rapi dan mudah ditelusuri?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(7, 3, 'Apakah pencatatan data pasien dilakukan secara lengkap dan konsisten?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(8, 4, 'Apakah rumah sakit memiliki prosedur pelaporan insiden keselamatan pasien?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(9, 4, 'Apakah staf memahami alur penanganan kondisi darurat pasien?', '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(10, 5, 'Apakah tenaga kesehatan memiliki kompetensi sesuai kebutuhan layanan?', '2026-07-01 16:56:51', '2026-07-01 16:56:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `hospital_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `hospital_id`, `created_at`, `updated_at`) VALUES
(1, 'Admin Dinas Kesehatan', 'admin@rs.com', '$2b$10$SyGEKw3zyACw11TXCse85eV8GHeUiAlP3jDJACAYyg3WZTViFRE5G', 'admin', NULL, '2026-07-01 16:56:51', '2026-07-01 16:56:51'),
(2, 'User RS Contoh Sehat', 'user@rs.com', '$2b$10$tPAOf5.9IonmhpMyY5m9bOKY5J52mcpoR.S0TIDkfrhDYXAkpFONS', 'user', 1, '2026-07-01 16:56:51', '2026-07-01 16:56:51');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_assessment_per_question` (`hospital_id`,`question_id`),
  ADD KEY `idx_assessments_hospital_id` (`hospital_id`),
  ADD KEY `idx_assessments_question_id` (`question_id`);

--
-- Indeks untuk tabel `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_hospital_code` (`code`);

--
-- Indeks untuk tabel `indicators`
--
ALTER TABLE `indicators`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_questions_indicator_id` (`indicator_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_email` (`email`),
  ADD KEY `idx_users_hospital_id` (`hospital_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `indicators`
--
ALTER TABLE `indicators`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `fk_assessments_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assessments_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `fk_questions_indicator` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_hospital` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
