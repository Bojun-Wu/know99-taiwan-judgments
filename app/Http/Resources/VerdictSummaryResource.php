<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerdictSummaryResource extends JsonResource
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
            'verdictId' => $this->verdict_id,
            'summaryZh' => $this->summary_zh,
            'summaryEn' => $this->summary_en,
            'upvotesZh' => $this->upvotes_zh,
            'downvotesZh' => $this->downvotes_zh,
            'upvotesEn' => $this->upvotes_en,
            'downvotesEn' => $this->downvotes_en,
            'status' => $this->status,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,

            'verdict' => VerdictResource::make($this->whenLoaded('verdict')),
        ];
    }
}
