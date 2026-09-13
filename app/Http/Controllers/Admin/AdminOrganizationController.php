<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Models\Verdict;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\VerdictResource;

class AdminOrganizationController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'sort_by' => 'nullable|string|in:id,name,verdicts_count,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $sortBy = $validated['sort_by'] ?? 'id';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $organizations = Organization::withCount('verdicts')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Organizations/AdminOrganizationIndex', [
            'organizations' => OrganizationResource::collection($organizations),
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Organizations/AdminOrganizationCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:organizations'
        ]);

        Organization::create($validated);

        return redirect()->route('admin.organizations.index')
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '組織 ' . $validated['name'] . ' 已新增',
                ],
            ]);
    }

    public function edit(Organization $organization)
    {
        $organization->load('verdicts');

        return Inertia::render('Admin/Organizations/AdminOrganizationEdit', [
            'organization' => OrganizationResource::make($organization),
        ]);
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:organizations,name,' . $organization->id
        ]);

        $organization->update($validated);

        return redirect()->route('admin.organizations.edit', $organization->id)
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '組織 ' . $organization->name . ' 已更新',
                ],
            ]);
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();

        return redirect()->route('admin.organizations.index')
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '組織 ' . $organization->name . ' 已刪除',
                ],
            ]);
    }

    public function detachVerdict(Organization $organization, Verdict $verdict)
    {
        $organization->verdicts()->detach($verdict);

        if ($organization->verdicts()->count() === 0) {
            $organization->delete();
            return redirect()->route('admin.organizations.index')
                ->with('message', [
                    [
                        'title' => 'Success',
                        'message' => '組織 ' . $organization->name . ' 已刪除',
                    ],
                ]);
        }

        return back()->with('message', [
            [
                'title' => 'Success',
                'message' => '判決書 ' . $verdict->verdict_id . ' 已從 ' . $organization->name . ' 中移除',
            ],
        ]);
    }
}
