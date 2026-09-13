<?php

use App\Models\Person;
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
        Schema::create('person_verdict', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignIdFor(Person::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Verdict::class)->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('person_verdict');
    }
};
