<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $randomRepoList = [
            [
                'owner' => 'microsoft',
                'repoName' => 'fluentui-system-icons',
            ],
            [
                'owner' => 'menloresearch',
                'repoName' => 'jan',
            ],
            [
                'owner' => 'anthropics',
                'repoName' => 'anthropic-cookbook',
            ],
            [
                'owner' => 'infiniflow',
                'repoName' => 'ragflow',
            ],
            [
                'owner' => 'deepseek-ai',
                'repoName' => 'DeepEP',
            ],
            [
                'owner' => 'automatisch',
                'repoName' => 'automatisch',
            ],
        ];

        $randomReadmeList = [];
        foreach ($randomRepoList as $repo) {
            $randomReadmeList[] = $this->getRandomReadme($repo['owner'], $repo['repoName']);
        }

        for ($i = 0; $i < 50; $i++) {
            $readme = fake()->randomElement($randomReadmeList);
            $createdAt = fake()->dateTimeBetween('-1 year', 'now');
            Post::create([
                'title' => fake()->sentence(),
                'slug' => fake()->slug(),
                'body' => $readme,
                'excerpt' => fake()->sentence(),
                'meta_description' => fake()->sentence(),
                'cover_image_url' => fake()->boolean() ? 'https://picsum.photos/id/' . fake()->numberBetween(1, 1000) . '/200/300' : null,
                'thumbnail_url' => fake()->boolean() ? 'https://picsum.photos/id/' . fake()->numberBetween(1, 1000) . '/50' : null,
                'status' => fake()->boolean() ? 'published' : fake()->randomElement(['draft', 'archived']),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
        }
    }

    private function getRandomReadme($owner, $repoName): string
    {
        $readme = Http::get("https://raw.githubusercontent.com/{$owner}/{$repoName}/refs/heads/main/README.md");
        return $readme->body();
    }
}
