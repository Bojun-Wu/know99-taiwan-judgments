<?php

namespace Database\Seeders;

use App\Models\KeywordLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KeywordLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KeywordLog::factory()->count(500)->create();
    }
}
