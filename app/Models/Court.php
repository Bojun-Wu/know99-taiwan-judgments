<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Court extends Model
{
    public function verdicts(): HasMany
    {
        return $this->hasMany(Verdict::class);
    }
}
