<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerdictSummary extends Model
{
    public function verdict(): BelongsTo
    {
        return $this->belongsTo(Verdict::class);
    }
}
