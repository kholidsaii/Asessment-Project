<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;
use App\Models\Category;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan slug 'uronefro' sudah ada di tabel categories lu Lid
        $uronefro = Category::where('slug', 'uronefrologi')->first();

        if (!$uronefro) {
            $this->command->error('Kategori Uronefro tidak ditemukan. Pastikan slug "uronefro" sudah ada!');
            return;
        }

        $questions = [
            [
                'section'      => 'Command & Control',
                'indicator'    => "Penanggung Jawab/Kepala Pelayanan Unggulan & Jejaring Rujukan (1 Orang)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Command & Control',
                'indicator'    => "Case Manager (1 Orang)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Command & Control',
                'indicator'    => "Tim Ginjal Terpadu",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Command & Control',
                'indicator'    => "Dokter Umum",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Command & Control',
                'indicator'    => "Perawat",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Hemodialisis dan CAPD Dewasa",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Hemodialisis dan CAPD Anak",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Continous Renal Replacement Theraphy (CRRT)",
                'is_paripurna' => true,
                'is_utama'     => false,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Biopsi Ginjal Terpandu USG",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Akses Vaskular (CDL dan AV Fistula)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Endourologi (URS, Litotripsi, PCNL)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Transplantasi Ginjal",
                'is_paripurna' => true,
                'is_utama'     => false,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Definisi & Klasifikasi',
                'indicator'    => "Sistem Informasi Penyakit Tidak Menular / SIMRS terintegrasi",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Spesialis Penyakit Dalam Konsultan Ginjal Hipertensi (Sp.PD-KGH)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Spesialis Anak Konsultan Nefrologi (Sp.A (K))",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Spesialis Urologi (Sp.U)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Spesialis Bedah Vaskular / Sp.BTKV",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Spesialis Patologi Klinik",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Perawat Mahir Dialisis",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Perawat Mahir Bedah Urologi",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Unit Dialisis",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Mesin hemodialisis dewasa",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Kamar Operasi (24/7)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Set Endourologi (Litotriptor, Bipolar system, PCNL, Pediatric Mini PCNL)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Laboratorium (Urinalisis, HbA1C, kalsium, fosfat, albumin creatinin ratio (ACR), ANA, ds-DNA, ASTO, C3, C4, IgA)",
                'is_paripurna' => true,
                'is_utama'     => true,
                'is_madya'     => true,
                'is_dasar'     => true,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "Mikroskop imunofluorosensi",
                'is_paripurna' => true,
                'is_utama'     => false,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
            [
                'section'      => 'Kriteria',
                'indicator'    => "ELISA Reader/Immunology Analyzer",
                'is_paripurna' => true,
                'is_utama'     => false,
                'is_madya'     => false,
                'is_dasar'     => false,
            ],
        ];

        foreach ($questions as $q) {
            Question::updateOrCreate(
                [
                    'category_id' => $uronefro->id,
                    'indicator'   => $q['indicator']
                ],
                $q
            );
        }

        $this->command->info('QuestionSeeder: Berhasil insert ' . count($questions) . ' indikator Uronefrologi!');
    }
}