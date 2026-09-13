<?php

namespace Database\Seeders;

use App\Models\VerdictView;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VerdictViewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VerdictView::factory()->count(1000)->create();
    }
}
