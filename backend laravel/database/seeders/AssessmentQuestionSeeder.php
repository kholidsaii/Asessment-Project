<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Question;
use Illuminate\Support\Str;

class AssessmentQuestionSeeder extends Seeder
{
    // database/seeders/AssessmentQuestionSeeder.php
public function run(): void
{
    $categories = [
        // Kelompok KJSU-KIA
        ['name' => 'Kanker', 'slug' => 'kanker', 'group' => 'KJSU-KIA'],
        ['name' => 'Jantung', 'slug' => 'jantung', 'group' => 'KJSU-KIA'],
        ['name' => 'Stroke', 'slug' => 'stroke', 'group' => 'KJSU-KIA'],
        ['name' => 'Uronefrologi', 'slug' => 'uronefrologi', 'group' => 'KJSU-KIA'],
        ['name' => 'KIA', 'slug' => 'kia', 'group' => 'KJSU-KIA'],
        
        // Kelompok Non KJSU-KIA
        ['name' => 'Jiwa', 'slug' => 'jiwa', 'group' => 'Non KJSU-KIA'],
        ['name' => 'Diabetes Melitus', 'slug' => 'dm', 'group' => 'Non KJSU-KIA'],
        ['name' => 'Gastrohepatologi', 'slug' => 'gastrohepatologi', 'group' => 'Non KJSU-KIA'],
        ['name' => 'Respirasi TB', 'slug' => 'respirasi-tb', 'group' => 'Non KJSU-KIA'],
        ['name' => 'Penyakit Infeksi Emerging', 'slug' => 'pie', 'group' => 'Non KJSU-KIA'],
    ];

    foreach ($categories as $cat) {
        Category::updateOrCreate(['slug' => $cat['slug']], $cat);
    }
}
}