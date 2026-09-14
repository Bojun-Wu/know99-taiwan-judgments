<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VerdictResource;
use App\Http\Resources\VerdictSummaryResource;
use App\Models\Verdict;
use App\Models\VerdictSummary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminVerdictSummaryController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'sort_by' => 'nullable|string|in:id,verdict_id,upvotes_zh,downvotes_zh,upvotes_en,downvotes_en,status,created_at,updated_at',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        $sortBy = $validated['sort_by'] ?? 'id';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        $summaries = VerdictSummary::with('verdict')
            ->orderBy($sortBy, $sortOrder)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/VerdictSummaries/AdminVerdictSummaryIndex', [
            'summaries' => VerdictSummaryResource::collection($summaries),
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
        ]);
    }

    public function edit(VerdictSummary $summary)
    {
        $summary->load('verdict');

        return Inertia::render('Admin/VerdictSummaries/AdminVerdictSummaryEdit', [
            'summary' => VerdictSummaryResource::make($summary),
        ]);
    }

    public function update(Request $request, VerdictSummary $summary)
    {
        $validated = $request->validate([
            'summary_zh' => 'required|string',
            'summary_en' => 'required|string',
            'upvotes_zh' => 'required|integer|min:0',
            'downvotes_zh' => 'required|integer|min:0',
            'upvotes_en' => 'required|integer|min:0',
            'downvotes_en' => 'required|integer|min:0',
            'status' => 'required|string|in:active,deprecated',
        ]);

        $summary->update($validated);

        return redirect()->route('admin.verdict-summaries.edit', $summary->id)
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '判決書摘要已更新',
                ],
            ]);
    }

    public function deprecate(VerdictSummary $summary)
    {
        $summary->update(['status' => 'deprecated']);

        return redirect()->back()
            ->with('message', [
                [
                    'title' => 'Success',
                    'message' => '判決書摘要已標記為已棄用',
                ],
            ]);
    }
}
