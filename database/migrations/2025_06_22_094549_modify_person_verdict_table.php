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
        Schema::table('person_verdict', function (Blueprint $table) {
            // 1. 先刪除現有的主鍵（如果表已存在）
            $table->dropPrimary();

            // 2. 刪除多餘的 id 欄位
            $table->dropColumn('id');

            // 3. 設置複合主鍵
            // 這會自動創建一個名為 'person_verdict_pkey' 的主鍵約束
            // 並且這個主鍵本身就是一個高效的複合索引 (person_id, verdict_id)
            $table->primary(['person_id', 'verdict_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('person_verdict', function (Blueprint $table) {
            // 撤銷操作，恢復到原來的結構

            // 1. 刪除複合主鍵
            $table->dropPrimary();

            // 2. 重新加上 id 主鍵
            $table->id()->first();
        });
    }
};
