<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminPostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'body' => $this->body,
            'excerpt' => $this->excerpt,
            'metaDescription' => $this->meta_description,
            'status' => $this->status,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'coverImageUrl' => $this->cover_image_url ?
                (Str::of($this->cover_image_url)->startsWith('http') ?
                    $this->cover_image_url : Storage::url($this->cover_image_url)) : null,
            'thumbnailUrl' => $this->thumbnail_url ?
                (Str::of($this->thumbnail_url)->startsWith('http') ?
                    $this->thumbnail_url : Storage::url($this->thumbnail_url)) : null,
            'author' => $this->author,

            'viewsCount' => $this->whenCounted('views'),
        ];
    }
}
