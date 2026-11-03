<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArtworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        DB::table('artworks')->insert([
            // 1. FanArt Bumi
            [
                'category_id'     => 1, // Digital Art
                'title'           => 'FanArt Bumi',
                'slug'            => 'fanart-bumi',
                'collection_type' => 'portfolio',
                'medium'          => 'Digital Art',
                'technique'       => 'Digital Illustration',
                'year'            => '2026',
                'description'     => 'A chibi-style character with blue hair and an earth-inspired element on the head.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => true,
                'img'             => 'artworks/digital/fanart-bumi.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 2. FanArt
            [
                'category_id'     => 1, // Digital Art
                'title'           => 'FanArt',
                'slug'            => 'fanart',
                'collection_type' => 'portfolio',
                'medium'          => 'Digital Art',
                'technique'       => 'Digital Illustration',
                'year'            => '2026',
                'description'     => 'A blue-haired character illustration in profile against a dark background.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/digital/fanart.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 3. Flexing
            [
                'category_id'     => 1, // Digital Art
                'title'           => 'Flexing',
                'slug'            => 'flexing',
                'collection_type' => 'portfolio',
                'medium'          => 'Digital Art',
                'technique'       => 'Digital Illustration',
                'year'            => '2026',
                'description'     => 'A green-haired character illustration with an expressive pose and accessory details.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => true,
                'img'             => 'artworks/digital/flexing.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 4. Full Body Digital
            [
                'category_id'     => 1, // Digital Art
                'title'           => 'Full Body Digital',
                'slug'            => 'full-body-digital',
                'collection_type' => 'portfolio',
                'medium'          => 'Digital Art',
                'technique'       => 'Digital Illustration',
                'year'            => '2026',
                'description'     => 'A full-body character study with a jacket, loose trousers, and detailed clothing.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/digital/full-body-digital.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 5. Half Body Digital
            [
                'category_id'     => 1, // Digital Art
                'title'           => 'Half Body Digital',
                'slug'            => 'half-body-digital',
                'collection_type' => 'portfolio',
                'medium'          => 'Digital Art',
                'technique'       => 'Digital Illustration',
                'year'            => '2026',
                'description'     => 'A character illustration with light hair, hand gestures, and a blue-toned palette.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/digital/half-body-digital.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 6. Headshot Digital
            [
                'category_id'     => 1, // Digital Art
                'title'           => 'Headshot Digital',
                'slug'            => 'headshot-digital',
                'collection_type' => 'portfolio',
                'medium'          => 'Digital Art',
                'technique'       => 'Digital Illustration',
                'year'            => '2026',
                'description'     => 'A chibi-style character expression with blue hair and a bright background.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/digital/headshot-digital.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 7. Poster LIDM
            [
                'category_id'     => 1, // Digital Art
                'title'           => 'Poster LIDM',
                'slug'            => 'poster-lidm',
                'collection_type' => 'portfolio',
                'medium'          => 'Digital Art',
                'technique'       => 'Digital Illustration',
                'year'            => '2026',
                'description'     => 'A poster composition combining typography, illustration, and contrasting colors.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => true,
                'img'             => 'artworks/digital/poster-lidm.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 8. Abstrak Gunung
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Abstrak Gunung',
                'slug'            => 'abstrak-gunung',
                'collection_type' => 'shop',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A colorful mountain composition with repeating line patterns, displayed in a frame.',
                'price'           => null,
                'status'          => 'sold',
                'featured'        => true,
                'img'             => 'artworks/traditional/abstrak-gunung.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 9. Abstrak
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Abstrak',
                'slug'            => 'abstrak',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'An exploration of organic forms and repeating lines using warm and cool colors.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/abstrak.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 10. DanDanDan
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'DanDanDan',
                'slug'            => 'dandandan',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A character drawing with dynamic hair, glasses, and pencil shading.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/dandandan.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 11. Frieren
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Frieren',
                'slug'            => 'frieren',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A portrait of a pointed-ear character with detailed hair, clothing, and shading.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/frieren.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 12. Full Body Kertas
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Full Body Kertas',
                'slug'            => 'full-body-kertas',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A full-body figure study on paper with detailed pose and clothing.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/full-body-kertas.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 13. Gothic
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Gothic',
                'slug'            => 'gothic',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A dark-haired character portrait with detailed eyes and a dramatic mood.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/gothic.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 14. Jasper
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Jasper',
                'slug'            => 'jasper',
                'collection_type' => 'shop',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A hooded character portrait with high-contrast shading and a dark atmosphere.',
                'price'           => 130000,
                'status'          => 'available',
                'featured'        => true,
                'img'             => 'artworks/traditional/jasper.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 15. MCR
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'MCR',
                'slug'            => 'mcr',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A character drawing composition with typography and handwritten notes around it.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/mcr.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 16. Pinterest Belajar
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Pinterest Belajar',
                'slug'            => 'pinterest-belajar',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A referenced character portrait study exploring proportion and shading.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/pinterest-belajar.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 17. Reference Study 02
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Reference Study 02',
                'slug'            => 'ref-pin-2',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A portrait study with glasses, hand gestures, and soft shading.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/ref-pin-2.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 18. Reference Study 01
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Reference Study 01',
                'slug'            => 'ref-pin',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A portrait study with long hair and clothing details rendered through shading.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/ref-pin.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 19. Style Ori
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Style Ori',
                'slug'            => 'style-ori',
                'collection_type' => 'portfolio',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A character exploration posing with a phone and layered clothing.',
                'price'           => null,
                'status'          => 'portfolio',
                'featured'        => false,
                'img'             => 'artworks/traditional/style-ori.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
            // 20. Waguri
            [
                'category_id'     => 2, // Traditional Art
                'title'           => 'Waguri',
                'slug'            => 'waguri',
                'collection_type' => 'shop',
                'medium'          => 'Traditional Art',
                'technique'       => 'Pencil / Mixed Traditional',
                'year'            => '2026',
                'description'     => 'A portrait of a character with long wavy hair and a smiling expression.',
                'price'           => 150000,
                'status'          => 'available',
                'featured'        => true,
                'img'             => 'artworks/traditional/waguri.jpeg',
                'created_at'      => $now,
                'updated_at'      => $now,
            ],
        ]);
    }
}