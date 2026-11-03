<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtworkResource;
use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArtworkController extends Controller
{
    /**
     * GET /api/artworks
     */
    public function index()
    {
        $artworks = Artwork::with('category')->orderBy('artwork_id', 'asc')->get();
        return ArtworkResource::collection($artworks);
    }

    /**
     * POST /api/artworks
     * Menerima input dari Admin React maupun Postman
     */
    public function store(Request $request)
    {
        // Konversi kategori jika dikirim dari Admin React ('digital' / 'traditional')
        $categoryId = $request->input('category_id') ?? $request->input('categoryId');
        if (!$categoryId && $request->has('category')) {
            $categoryId = strtolower($request->input('category')) === 'digital' ? 1 : 2;
        }
        $request->merge(['category_id' => $categoryId ?: 1]);

        $request->validate([
            'title'       => 'required|string|max:150',
            'category_id' => 'required|exists:categories,category_id',
        ]);

        $folder = $request->category_id == 1 ? 'artworks/digital' : 'artworks/traditional';
        $path = null;

        // 1. Jika upload file lewat Postman (form-data file 'img')
        if ($request->hasFile('img')) {
            $path = $request->file('img')->store($folder, 'public');
        }
        // 2. Jika upload foto lewat Admin React (Base64 image string)
        elseif ($request->filled('image') && str_starts_with($request->input('image'), 'data:image')) {
            $path = $this->saveBase64Image($request->input('image'), $folder);
        }
        // 3. Jika menggunakan URL storage yang sudah ada
        elseif ($request->filled('image') && str_contains($request->input('image'), '/storage/')) {
            $path = substr($request->input('image'), strpos($request->input('image'), '/storage/') + 9);
        }

        $defaultMedium = $request->category_id == 1 ? 'Digital Art' : 'Traditional Art';
        $collectionType = $request->input('collection_type') ?? $request->input('collectionType') ?? 'portfolio';

        // Pastikan slug unik di database
        $baseSlug = Str::slug($request->input('slug') ?: $request->input('title'));
        $slug = $baseSlug ?: 'artwork-' . time();
        if (Artwork::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . strtolower(Str::random(4));
        }

        $price = $request->input('price');
        if ($price === '' || $price === null || $collectionType === 'portfolio') {
            $price = $price !== null && $price !== '' ? (float) $price : null;
        }

        $artwork = Artwork::create([
            'category_id'     => $request->category_id,
            'title'           => $request->input('title'),
            'slug'            => $slug,
            'collection_type' => $collectionType,
            'medium'          => $request->input('medium') ?: $defaultMedium,
            'technique'       => $request->input('technique') ?: ($request->category_id == 1 ? 'Digital Illustration' : 'Pencil / Mixed Traditional'),
            'year'            => (string) ($request->input('year') ?: date('Y')),
            'description'     => $request->input('description') ?? '',
            'price'           => $price,
            'status'          => $request->input('status') ?: ($collectionType === 'shop' ? 'available' : 'portfolio'),
            'featured'        => filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN),
            'img'             => $path,
        ]);

        return new ArtworkResource($artwork->load('category'));
    }

    /**
     * GET /api/artworks/{id_atau_slug}
     */
    public function show(string $identifier)
    {
        $artwork = Artwork::with('category')
            ->where('artwork_id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        return new ArtworkResource($artwork);
    }

    /**
     * PUT/PATCH /api/artworks/{id_atau_slug}
     * Otomatis menyinkronkan editan dari Admin React maupun Postman ke Database
     */
    public function update(Request $request, string $identifier)
    {
        $artwork = Artwork::where('artwork_id', $identifier)
            ->orWhere('slug', $identifier)
            ->firstOrFail();

        // Penyesuaian category_id dari React ('digital'/'traditional') atau Postman
        $categoryId = $request->input('category_id') ?? $request->input('categoryId');
        if (!$categoryId && $request->has('category')) {
            $categoryId = strtolower($request->input('category')) === 'digital' ? 1 : 2;
        }
        $categoryId = $categoryId ?: $artwork->category_id;

        $folder = $categoryId == 1 ? 'artworks/digital' : 'artworks/traditional';
        $path = $artwork->img;

        // Jika ganti gambar dari Postman
        if ($request->hasFile('img')) {
            $path = $request->file('img')->store($folder, 'public');
        }
        // Jika ganti gambar dari Admin React (Base64)
        elseif ($request->filled('image') && str_starts_with($request->input('image'), 'data:image')) {
            $newPath = $this->saveBase64Image($request->input('image'), $folder);
            if ($newPath) {
                $path = $newPath;
            }
        }

        $title = $request->input('title', $artwork->title);
        $slug = $artwork->slug;
        if ($request->filled('slug') && $request->input('slug') !== $artwork->slug) {
            $candidate = Str::slug($request->input('slug'));
            if (!Artwork::where('slug', $candidate)->where('artwork_id', '!=', $artwork->artwork_id)->exists()) {
                $slug = $candidate;
            }
        }

        $collectionType = $request->input('collection_type')
            ?? $request->input('collectionType')
            ?? $artwork->collection_type;

        $price = $request->has('price') ? $request->input('price') : $artwork->price;
        if ($price === '' || $price === null) {
            $price = null;
        }

        $artwork->update([
            'category_id'     => $categoryId,
            'title'           => $title,
            'slug'            => $slug,
            'collection_type' => $collectionType,
            'medium'          => $request->input('medium') ?? ($categoryId == 1 ? 'Digital Art' : 'Traditional Art'),
            'technique'       => $request->input('technique', $artwork->technique),
            'year'            => (string) $request->input('year', $artwork->year),
            'description'     => $request->input('description', $artwork->description),
            'price'           => $price,
            'status'          => $request->input('status', $artwork->status),
            'featured'        => $request->has('featured')
                ? filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN)
                : $artwork->featured,
            'img'             => $path,
        ]);

        return new ArtworkResource($artwork->load('category'));
    }

    /**
     * DELETE /api/artworks/{id_atau_slug}
     */
    public function destroy(string $identifier)
    {
        $artwork = Artwork::where('artwork_id', $identifier)
            ->orWhere('slug', $identifier)
            ->first();

        if ($artwork != null) {
            $artwork->delete();
            return response()->json(['message' => 'Artwork deleted successfully']);
        }

        return response()->json(['message' => 'Artwork not found'], 404);
    }

    /**
     * Helper untuk mengubah gambar Base64 dari Admin React menjadi file fisik di storage Laravel
     */
    private function saveBase64Image(string $base64String, string $folder): ?string
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $extension = strtolower($type[1]);
            if ($extension === 'jpeg') {
                $extension = 'jpg';
            }
            $decoded = base64_decode($data);
            if ($decoded === false) {
                return null;
            }
            $fileName = $folder . '/' . Str::random(40) . '.' . $extension;
            Storage::disk('public')->put($fileName, $decoded);
            return $fileName;
        }
        return null;
    }
}