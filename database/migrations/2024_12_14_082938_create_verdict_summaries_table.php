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
            $table->text('summary_zh');
            $table->text('summary_en');
            $table->integer('upvotes_zh')->default(0);
            $table->integer('downvotes_zh')->default(0);
            $table->integer('upvotes_en')->default(0);
            $table->integer('downvotes_en')->default(0);
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
