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
        Schema::table('organization_verdict', function (Blueprint $table) {
            $table->dropPrimary();
            $table->dropColumn('id');
            $table->primary(['organization_id', 'verdict_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organization_verdict', function (Blueprint $table) {
            $table->dropPrimary();
            $table->id()->first();
        });
    }
};
