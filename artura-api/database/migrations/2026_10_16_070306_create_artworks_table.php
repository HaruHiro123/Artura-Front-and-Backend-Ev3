<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artworks', function (Blueprint $table) {
            $table->id('artwork_id');
            $table->foreignId('category_id');
            $table->string('title', 150);
            $table->string('slug')->unique();
            $table->string('collection_type', 20)->default('portfolio'); // portfolio | shop
            $table->string('medium', 50)->nullable();
            $table->string('technique', 100)->nullable();
            $table->string('year', 4)->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->string('status', 20)->default('portfolio'); // portfolio | available | sold
            $table->boolean('featured')->default(false);
            $table->string('img')->nullable();
            $table->timestamps();

            // Relasi Foreign Key ke tabel categories
            $table->foreign('category_id')
                  ->references('category_id')
                  ->on('categories')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artworks');
    }
};