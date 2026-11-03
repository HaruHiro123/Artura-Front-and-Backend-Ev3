<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArtworkController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StoreDataController;
use App\Models\Category;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', function () {
    return response()->json(Category::orderBy('category_id')->get());
});

Route::get('/artworks', [ArtworkController::class, 'index']);
Route::get('/artworks/{identifier}', [ArtworkController::class, 'show']);

// Endpoint Sinkronisasi Cart, Orders, Commissions, Reviews, dan Settings ke MySQL
Route::get('/store-data', [StoreDataController::class, 'getStoreData']);
Route::post('/store-data', [StoreDataController::class, 'syncStoreData']);
Route::get('/cart', [StoreDataController::class, 'getCart']);
Route::post('/cart', [StoreDataController::class, 'syncCart']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/artworks', [ArtworkController::class, 'store']);
    Route::put('/artworks/{identifier}', [ArtworkController::class, 'update']);
    Route::patch('/artworks/{identifier}', [ArtworkController::class, 'update']);
    Route::post('/artworks/{identifier}', [ArtworkController::class, 'update']);
    Route::delete('/artworks/{identifier}', [ArtworkController::class, 'destroy']);
});