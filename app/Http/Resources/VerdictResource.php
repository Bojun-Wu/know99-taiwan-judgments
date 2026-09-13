<?php

namespace App\Http\Resources;

use App\Models\VerdictSummary;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerdictResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $relationships = [
            'court' => $this->whenLoaded('court'),
            'people' => PersonResource::collection($this->whenLoaded('people')),
            'organizations' => OrganizationResource::collection($this->whenLoaded('organizations')),
            'summary' => VerdictSummaryResource::make($this->whenLoaded('summary')),
            'summaries' => VerdictSummaryResource::collection($this->whenLoaded('summaries')),
            'viewsCount' => $this->whenCounted('views'),
        ];

        return array_merge([
            'id' => $this->id,
            'verdictId' => $this->verdict_id,
            'year' => $this->year,
            'category' => $this->category,
            'number' => $this->number,
            'title' => $this->title,
            'content' => $this->content,
            'judgementDate' => $this->judgement_date,
            'type' => $this->type,
            'keywords' => $this->keywords,
            'updatedAt' => $this->updated_at,
        ], $relationships);
    }
}
