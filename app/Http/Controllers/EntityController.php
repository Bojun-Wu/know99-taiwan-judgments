<?php

namespace App\Http\Controllers;

use App\Http\Resources\VerdictResource;
use App\Models\Person;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Services\EntityService;

class EntityController extends Controller
{
    protected $entityService;

    public function __construct(EntityService $entityService)
    {
        $this->entityService = $entityService;
    }

    public function index(Request $request)
    {
        $request->validate([
            'query' => 'nullable|string|max:255',
            'page' => 'sometimes|integer|min:1',
        ]);

        $query = $request->get('query');
        $perPage = 12;

        $entities = $this->entityService->searchEntities($query, $perPage);

        return Inertia::render('Entities/EntityIndex', [
            'entities' => $entities,
            'query' => $query,
        ]);
    }

    public function showPerson(Request $request, string $name)
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
        ]);

        $person = Person::where('name', $name)->first();

        // Get paginated verdicts for this person
        $verdicts = $person ? $person->verdicts()
            ->with(['court'])
            ->orderBy('judgement_date', 'desc')
            ->paginate(10)
            ->withQueryString() : null;

        return Inertia::render('Entities/EntityShow', [
            'name' => $name,
            'entityType' => 'person',
            'verdicts' => $verdicts ? VerdictResource::collection($verdicts) : null,
        ]);
    }

    public function showOrganization(Request $request, string $name)
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
        ]);

        $organization = Organization::where('name', $name)->first();

        // Get paginated verdicts for this organization
        $verdicts = $organization ? $organization->verdicts()
            ->with(['court'])
            ->orderBy('judgement_date', 'desc')
            ->paginate(10)
            ->withQueryString() : null;

        return Inertia::render('Entities/EntityShow', [
            'name' => $name,
            'entityType' => 'organization',
            'verdicts' => $verdicts ? VerdictResource::collection($verdicts) : null,
        ]);
    }
}
