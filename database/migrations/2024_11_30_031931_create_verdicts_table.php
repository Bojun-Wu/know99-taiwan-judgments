<?php

use App\Models\Court;
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
        Schema::create('verdicts', function (Blueprint $table) {
            $table->id();
            // 112年度附民字第131號
            $table->string('verdict_id')->unique(); //SLDM-112-附民-131-20250331-1
            $table->year('year'); //年度
            $table->string('category'); //字號 (附民)
            $table->integer('number'); //案號 (131) 
            $table->string('title'); //標題（損害賠償）
            $table->text('content'); // 全文
            $table->date('judgement_date'); // 判決日期
            $table->enum('type', ['憲法', '民事', '刑事', '行政', '懲戒', '其他'])->default('其他');
            $table->json('keywords')->nullable(); // 關鍵字
            $table->timestamps();
            
            $table->foreignIdFor(Court::class)->constrained()->cascadeOnDelete();

            $table->index('judgement_date');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verdicts');
    }
};
