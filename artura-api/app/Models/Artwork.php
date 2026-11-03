<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
    use HasFactory;

    protected $primaryKey = 'artwork_id';

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'collection_type',
        'medium',
        'technique',
        'year',
        'description',
        'price',
        'status',
        'featured',
        'img',
    ];

    // Setiap karya seni dimiliki oleh satu kategori
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}