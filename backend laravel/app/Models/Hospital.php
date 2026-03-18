<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospital extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'class', 'code'];

    /**
     * Relasi ke tabel hospital_priorities (Has Many)
     * Karena satu RS bisa punya banyak kategori prioritas (KIA, Stroke, dll)
     */
    public function priorities()
    {
        // Pastikan nama modelnya 'HospitalPriority' sesuai yang lu buat ya
        return $this->hasMany(HospitalPriority::class, 'hospital_id');
    }
}