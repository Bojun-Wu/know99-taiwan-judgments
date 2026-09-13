<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;
use Spatie\Sitemap\Contracts\Sitemapable;
use Spatie\Sitemap\Tags\Url;

class Verdict extends Model implements Sitemapable
{
    use HasFactory, Searchable;

    protected $casts = [
        'keywords' => 'json:unicode',
    ];

    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    public function people(): BelongsToMany
    {
        return $this->belongsToMany(Person::class);
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class);
    }

    public function summaries(): HasMany
    {
        return $this->hasMany(VerdictSummary::class);
    }
    public function summary(): HasOne
    {
        return $this->hasOne(VerdictSummary::class)->where('status', 'active')->latest();
    }

    public function views(): HasMany
    {
        return $this->hasMany(VerdictView::class);
    }

    public function getRouteKeyName()
    {
        return 'verdict_id';
    }

    public function toSitemapTag(): Url | string | array
    {
        return Url::create(route('verdicts.show', $this->verdict_id))->setLastModificationDate($this->updated_at);
    }

    public function toSearchableArray()
    {
        /*
            經過刪除非中文、非英文、非數字後
            約 10% content 超過 3400 字
            約 5% content 超過 6000 字
        */

        $contentProcessed = '';
        $cleanedContent = Str::of(preg_replace('/[^\p{Han}\p{Latin}\d]/u', '', $this->content));
        if ($cleanedContent->length() < 6000) {
            $contentProcessed = $cleanedContent;
        } else {
            $contentProcessed .= mb_substr($cleanedContent, 0, 5500);
            $contentProcessed .= mb_substr($cleanedContent, -500);
        }
        Log::info("Clean content:
            id: {$this->id}
            content length: " . Str::of($this->content)->length() . "
            cleaned content length: " . $cleanedContent->length() . "
            processed content length: " . mb_strlen($contentProcessed) . "
            content: {$contentProcessed}
        ");

        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'verdict_id' => $this->verdict_id,
            'content' => $contentProcessed,
        ];
    }
}
