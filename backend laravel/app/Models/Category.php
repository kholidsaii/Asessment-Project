<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // Tambahkan 'group' agar bisa diisi via Seeder
    protected $fillable = ['name', 'slug', 'group']; 

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}