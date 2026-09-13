<?php

namespace Database\Factories;

use App\Models\Verdict;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VerdictView>
 */
class VerdictViewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $view_at = fake()->dateTimeBetween('-1 month', 'now');
        return [
            'verdict_id' => Verdict::inRandomOrder()->first()->id,
            'ip_address' => fake()->ipv4,
            'session_id' => fake()->regexify('[a-fA-F0-9]{40}'),
            'created_at' => $view_at,
            'updated_at' => $view_at,
        ];
    }
}
