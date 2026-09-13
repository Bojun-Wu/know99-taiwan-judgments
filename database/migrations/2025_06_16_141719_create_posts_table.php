<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('body');
            $table->text('excerpt');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->text('meta_description');
            $table->string('author')->nullable();

            // image
            $table->string('cover_image_url')->nullable();
            $table->string('thumbnail_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
