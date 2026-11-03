<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtworkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $categoryName = $this->category?->category ?? ($this->category_id == 1 ? 'Digital Art' : 'Traditional Art');
        $categorySlug = $this->category_id == 1 ? 'digital' : 'traditional';

        return [
            'id'             => $this->artwork_id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'image'          => $this->img ? url('storage/' . $this->img) : null,
            'category'       => $categorySlug,       // 'digital' atau 'traditional' (untuk filter Portfolio.jsx)
            'categoryName'   => $categoryName,       // 'Digital Art' atau 'Traditional Art'
            'medium'         => $this->medium ?? $categoryName,
            'collectionType' => $this->collection_type,
            'year'           => $this->year,
            'technique'      => $this->technique,
            'description'    => $this->description,
            'price'          => $this->price !== null ? (float) $this->price : null,
            'status'         => $this->status,
            'rating'         => null,
            'reviews'        => [],
            'featured'       => (bool) $this->featured,
            'categoryId'     => $this->category_id,
            'createdAt'      => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}