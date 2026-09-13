<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

class Post extends Model implements Sitemapable
{
    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route('posts.show', $this->slug))->setLastModificationDate($this->updated_at);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(PostTag::class)->withTimestamps();
    }

    public function views(): HasMany
    {
        return $this->hasMany(PostView::class);
    }
}
