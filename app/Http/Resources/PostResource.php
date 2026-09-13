<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $shortBody = Str::of($this->body)->markdown()->stripTags()->take(100) . '...';

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'body' => Str::of($this->body)->markdown(),
            'excerpt' => $this->excerpt ?? $shortBody,
            'metaDescription' => $this->meta_description ?? $shortBody,
            'status' => $this->status,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'coverImageUrl' => $this->cover_image_url ?
                (Str::of($this->cover_image_url)->startsWith('http') ?
                    $this->cover_image_url : Storage::url($this->cover_image_url)) : env('IMAGE_FALLBACK_URL'),
            'thumbnailUrl' => $this->thumbnail_url ?
                (Str::of($this->thumbnail_url)->startsWith('http') ?
                    $this->thumbnail_url : Storage::url($this->thumbnail_url)) : env('IMAGE_FALLBACK_URL'),
            'viewsCount' => $this->whenCounted('views'),
            'author' => $this->author ?? 'Know99 小助手',
        ];
    }
}
