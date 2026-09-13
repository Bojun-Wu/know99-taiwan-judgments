<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourtResource;
use App\Http\Resources\OrganizationResource;
use App\Http\Resources\PersonResource;
use App\Http\Resources\VerdictResource;
use App\Models\Verdict;
use App\Models\Court;
use App\Models\Person;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminVerdictController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'sort_by' => 'nullable|string|in:id,verdict_id,title,judgement_date,type,views_count,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $sortBy = $validated['sort_by'] ?? 'id';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $verdicts = Verdict::with(['court', 'people', 'organizations'])
            ->withCount('views')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Verdicts/AdminVerdictIndex', [
            'verdicts' => VerdictResource::collection($verdicts),
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
        ]);
    }

    public function edit(Verdict $verdict)
    {
        $verdict->load(['court', 'people', 'organizations', 'summaries']);

        return Inertia::render('Admin/Verdicts/AdminVerdictEdit', [
            'verdict' => VerdictResource::make($verdict),
            'courts' => CourtResource::collection(Court::all()),
            'people' => PersonResource::collection(Person::all()),
            'organizations' => OrganizationResource::collection(Organization::all())
        ]);
    }

    public function update(Request $request, Verdict $verdict)
    {
        $validated = $request->validate([
            'verdict_id' => 'required|unique:verdicts,verdict_id,' . $verdict->id,
            'year' => 'required|integer',
            'category' => 'required|string',
            'number' => 'required|integer',
            'title' => 'required|string',
            'content' => 'required|string',
            'judgement_date' => 'required|date',
            'type' => 'required|string|in:憲法,民事,刑事,行政,懲戒,其他',
            'court_id' => 'required|exists:courts,id',
            'people' => 'array',
            'people.*' => 'exists:people,id',
            'organizations' => 'array',
            'organizations.*' => 'exists:organizations,id',
            'keywords' => 'nullable|array'
        ]);

        $updateData = $validated;
        unset($updateData['people']);
        unset($updateData['organizations']);

        $verdict->update($updateData);

        if (isset($validated['people'])) {
            $changes = $verdict->people()->sync($validated['people']);
            if (!empty($changes['detached'])) {
                Person::whereIn('id', $changes['detached'])->whereDoesntHave('verdicts')->delete();
            }
        }

        if (isset($validated['organizations'])) {
            $changes = $verdict->organizations()->sync($validated['organizations']);
            if (!empty($changes['detached'])) {
                Organization::whereIn('id', $changes['detached'])->whereDoesntHave('verdicts')->delete();
            }
        }

        return redirect()->route('admin.verdicts.edit', $verdict->id)
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '判決書 ' . $verdict->verdict_id . ' 已更新',
                ],
            ]);
    }

    public function destroy(Verdict $verdict)
    {
        $verdict->delete();

        return redirect()->route('admin.verdicts.index')
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '判決書 ' . $verdict->verdict_id . ' 已刪除',
                ],
            ]);
    }
}
