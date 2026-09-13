<?php

use App\Models\Verdict;
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
        Schema::create('verdict_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Verdict::class)->constrained()->cascadeOnDelete();
            $table->text('summary');
            $table->integer('upvotes')->default(0);
            $table->integer('downvotes')->default(0);
            $table->enum('status', ['active', 'deprecated'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verdict_summaries');
    }
};
