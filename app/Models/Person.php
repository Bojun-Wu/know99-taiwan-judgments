<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

// person model (table name: people)
class Person extends Model implements Sitemapable
{
    use Searchable;

    public function getRouteKeyName()
    {
        return 'name';
    }

    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route('people.show', $this->name))->setLastModificationDate(now());
    }

    public function verdicts(): BelongsToMany
    {
        return $this->belongsToMany(Verdict::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
        ];
    }
}
