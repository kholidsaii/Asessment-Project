<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'category_id',
        'section',
        'indicator',
        'required_count',
        // Tambahkan kolom strata ini biar Seeder-nya tembus!
        'is_paripurna',
        'is_utama',
        'is_madya',
        'is_dasar'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}