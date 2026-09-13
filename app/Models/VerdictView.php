<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VerdictView extends Model
{
    use HasFactory;

    public function verdict(): BelongsTo
    {
        return $this->belongsTo(Verdict::class);
    }
}
