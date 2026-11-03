<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'category'   => 'Digital Art',      // Otomatis mendapat category_id = 1
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category'   => 'Traditional Art',  // Otomatis mendapat category_id = 2
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}