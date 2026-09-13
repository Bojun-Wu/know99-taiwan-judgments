<?php

namespace App\Http\Resources;

use App\Http\Resources\VerdictResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
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
            'name' => $this->name,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,

            'verdictsCount' => $this->whenCounted('verdicts'),
            'verdicts' => VerdictResource::collection($this->whenLoaded('verdicts')),
        ];
    }
}
