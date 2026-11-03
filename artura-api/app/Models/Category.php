<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id';
    protected $fillable = ['category'];

    // Satu kategori memiliki banyak karya seni
    public function artworks()
    {
        return $this->hasMany(Artwork::class, 'category_id', 'category_id');
    }
}