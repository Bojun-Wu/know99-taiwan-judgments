<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PersonResource;
use App\Models\Person;
use App\Models\Verdict;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\VerdictResource;

class AdminPersonController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'sort_by' => 'nullable|string|in:id,name,verdicts_count,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $sortBy = $validated['sort_by'] ?? 'id';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $people = Person::withCount('verdicts')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/People/AdminPersonIndex', [
            'people' => PersonResource::collection($people),
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/People/AdminPersonCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:people',
        ]);

        Person::create($validated);

        return redirect()->route('admin.people.index')
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '人員 ' . $validated['name'] . ' 已新增',
                ],
            ]);
    }

    public function edit(Person $person)
    {
        $person->load('verdicts');

        return Inertia::render('Admin/People/AdminPersonEdit', [
            'person' => PersonResource::make($person),
        ]);
    }

    public function update(Request $request, Person $person)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:people,name,' . $person->id,
        ]);

        $person->update($validated);

        return redirect()->route('admin.people.edit', $person->id)
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '人員 ' . $person->name . ' 已更新',
                ],
            ]);
    }

    public function destroy(Person $person)
    {
        $person->delete();

        return redirect()->route('admin.people.index')
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '人員 ' . $person->name . ' 已刪除',
                ],
            ]);
    }

    public function detachVerdict(Person $person, Verdict $verdict)
    {
        $person->verdicts()->detach($verdict);

        if ($person->verdicts()->count() === 0) {
            $person->delete();
            return redirect()->route('admin.people.index')
                ->with('message', [
                    [
                        'title' => 'Success',
                        'message' => '人員 ' . $person->name . ' 已刪除',
                    ],
                ]);
        }

        return back()->with('message', [
            [
                'title' => 'Success',
                'message' => '判決書 ' . $verdict->verdict_id . ' 已從 ' . $person->name . ' 中移除',
            ],
        ]);
    }
}
