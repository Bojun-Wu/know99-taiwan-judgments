<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminPostResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminPostController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'sort_by' => 'nullable|string|in:id,title,slug,author,status,views_count,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $sortBy = $validated['sort_by'] ?? 'id';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $posts = Post::withCount('views')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Posts/AdminPostIndex', [
            'posts' => AdminPostResource::collection($posts),
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
        ]);
    }

    public function create()
    {
        $postCount = Post::count();
        return Inertia::render('Admin/Posts/AdminPostEditor', [
            'postCount' => $postCount,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug',
            'body' => 'required|string',
            'excerpt' => 'required|string',
            'meta_description' => 'required|string',
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'cover_image' => 'nullable|image|max:2048',
            'thumbnail' => 'nullable|image|max:2048',
            'author' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::of($validated['title'])->slug('-');

        if ($request->hasFile('cover_image')) {
            $validated['cover_image_url'] = $request->file('cover_image')->storePublicly('posts/covers');
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail_url'] = $request->file('thumbnail')->storePublicly('posts/thumbnails');
        }

        unset($validated['cover_image']);
        unset($validated['thumbnail']);

        $post = $this->postService->createPost($validated);

        return redirect()->route('admin.posts.index')
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '文章已新增',
                ],
            ]);
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/AdminPostEditor', [
            'post' => AdminPostResource::make($post)
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:posts,slug,' . $post->id,
            'body' => 'required|string',
            'excerpt' => 'required|string',
            'meta_description' => 'required|string',
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'cover_image' => 'nullable|image|max:2048',
            'thumbnail' => 'nullable|image|max:2048',
            'clear_cover_image' => 'nullable|boolean',
            'clear_thumbnail' => 'nullable|boolean',
            'author' => 'nullable|string|max:255',
        ]);
        $validated['slug'] = $validated['slug'] ?? Str::of($validated['title'])->slug('-');

        // Handle cover image
        if ($request->hasFile('cover_image')) {
            // Delete old cover image if exists
            if ($post->cover_image_url) {
                Storage::delete($post->cover_image_url);
            }
            $validated['cover_image_url'] = $request->file('cover_image')->storePublicly('posts/covers');
        } elseif ($request->boolean('clear_cover_image') && $post->cover_image_url) {
            // Delete cover image if cleared
            Storage::delete($post->cover_image_url);
            $validated['cover_image_url'] = null;
        }

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($post->thumbnail_url) {
                Storage::delete($post->thumbnail_url);
            }
            $validated['thumbnail_url'] = $request->file('thumbnail')->storePublicly('posts/thumbnails');
        } elseif ($request->boolean('clear_thumbnail') && $post->thumbnail_url) {
            // Delete thumbnail if cleared
            Storage::delete($post->thumbnail_url);
            $validated['thumbnail_url'] = null;
        }

        unset($validated['clear_cover_image']);
        unset($validated['clear_thumbnail']);
        unset($validated['cover_image']);
        unset($validated['thumbnail']);

        $post = $this->postService->updatePost($post, $validated);

        return redirect()->route('admin.posts.edit', $post->id)
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '文章已更新',
                ],
            ]);
    }

    public function destroy(Post $post)
    {
        $this->postService->deletePost($post);

        return redirect()->route('admin.posts.index')
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '文章已刪除',
                ],
            ]);
    }
}
