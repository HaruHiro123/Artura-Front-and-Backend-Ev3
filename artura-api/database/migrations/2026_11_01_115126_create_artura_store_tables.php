<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->string('client_key', 100)->unique();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->json('items');
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 50)->unique();
            $table->string('customer_name', 150)->nullable();
            $table->string('customer_email', 150)->nullable();
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('status', 50)->default('pending');
            $table->string('payment_status', 50)->default('unpaid');
            $table->longText('payload');
            $table->timestamps();
        });

        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->string('commission_code', 50)->unique();
            $table->string('client_name', 150)->nullable();
            $table->string('media_type', 50)->nullable();
            $table->decimal('final_price', 15, 2)->default(0);
            $table->string('status', 50)->default('new');
            $table->string('payment_status', 50)->default('waiting-approval');
            $table->longText('payload');
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('review_code', 50)->unique();
            $table->string('reviewer_name', 150)->nullable();
            $table->integer('rating')->default(5);
            $table->text('comment')->nullable();
            $table->longText('payload');
            $table->timestamps();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('setting_key', 100)->unique();
            $table->longText('setting_value');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('commissions');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('carts');
    }
};