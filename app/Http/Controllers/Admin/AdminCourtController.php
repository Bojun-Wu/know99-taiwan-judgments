<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourtResource;
use App\Models\Court;
use App\Models\Verdict;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\VerdictResource;

class AdminCourtController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'sort_by' => 'nullable|string|in:id,name,verdicts_count,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $sortBy = $validated['sort_by'] ?? 'id';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $courts = Court::withCount('verdicts')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Courts/AdminCourtIndex', [
            'courts' => CourtResource::collection($courts),
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
        ]);
    }

    public function edit(Court $court)
    {
        $court->load('verdicts');

        return Inertia::render('Admin/Courts/AdminCourtEdit', [
            'court' => CourtResource::make($court),
        ]);
    }

    public function update(Request $request, Court $court)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:courts,name,' . $court->id
        ]);

        $court->update($validated);

        return redirect()->route('admin.courts.edit', $court->id)
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '法院 ' . $court->name . ' 已更新',
                ],
            ]);
    }
}
