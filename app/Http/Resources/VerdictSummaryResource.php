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
            'summary' => $this->summary,
            'upvotes' => $this->upvotes,
            'downvotes' => $this->downvotes,
            'status' => $this->status,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,

            'verdict' => VerdictResource::make($this->whenLoaded('verdict')),
        ];
    }
}
