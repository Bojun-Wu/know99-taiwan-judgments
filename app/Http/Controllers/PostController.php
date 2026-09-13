<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\PostResource;
use App\Jobs\LogPostView;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::where('status', 'published')->latest()->paginate(12);

        return Inertia::render('Posts/PostIndex', [
            'posts' => PostResource::collection($posts),
        ]);
    }

    public function show(Request $request, Post $post)
    {
        $isAdmin = Auth::check() && Auth::user()->is_admin;
        abort_if($post->status !== 'published' && !$isAdmin, 404);

        // Dispatch the job to log the view asynchronously
        LogPostView::dispatch(
            $post->id,
            $request->ip(),
            $request->session()->getId()
        );

        return Inertia::render('Posts/PostShow', [
            'post' => PostResource::make($post),
        ]);
    }
}
