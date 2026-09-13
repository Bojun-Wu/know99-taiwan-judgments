<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Verdict;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('verdict_views', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignIdFor(Verdict::class)->constrained()->cascadeOnDelete();
            $table->ipAddress('ip_address');
            $table->string('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verdict_views');
    }
};
