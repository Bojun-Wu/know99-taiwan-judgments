<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class PostService
{
    public function getRecentPosts(int $limit = 4)
    {
        $recentPostsIds = Cache::remember('recent-posts-ids-limit-' . $limit, 3600, function () use ($limit) {
            return Post::where('status', 'published')->latest()->limit($limit)->pluck('id');
        });

        $posts = Post::whereIn('id', $recentPostsIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return $posts;
    }

    public function createPost(array $data): Post
    {
        return Post::create($data);
    }

    public function updatePost(Post $post, array $data): Post
    {
        $post->update($data);
        return $post;
    }

    public function deletePost(Post $post): bool
    {
        // Delete associated images from R2 storage
        if ($post->cover_image_url) {
            Storage::delete($post->cover_image_url);
        }
        if ($post->thumbnail_url) {
            Storage::delete($post->thumbnail_url);
        }
        Storage::delete('posts/content/' . $post->id);

        return $post->delete();
    }
}
