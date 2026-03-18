<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hospital_priorities', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel hospitals
            $table->foreignId('hospital_id')->constrained()->onDelete('cascade');
            // Menghubungkan ke tabel categories
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            // Menyimpan pilihan Paripurna/Utama/Madya/Dasar
            $table->string('target_strata'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hospital_priorities');
    }
};