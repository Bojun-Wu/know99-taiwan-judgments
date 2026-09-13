<?php

namespace App\Http\Controllers;

use App\Http\Resources\VerdictResource;
use App\Models\Verdict;
use App\Models\VerdictSummary;
use App\Services\VerdictSummaryService;
use App\Services\GooglebotDetectionService;
use Illuminate\Http\Request;

class VerdictAIAnalysisController extends Controller
{
    protected VerdictSummaryService $summaryService;
    protected GooglebotDetectionService $googlebotDetectionService;

    public function __construct(VerdictSummaryService $summaryService, GooglebotDetectionService $googlebotDetectionService)
    {
        $this->summaryService = $summaryService;
        $this->googlebotDetectionService = $googlebotDetectionService;
    }

    public function getAIAnalysisVerdict(Verdict $verdict, Request $request)
    {
        if (!$verdict->summary) {
            // Check if this is a Googlebot request
            if ($this->googlebotDetectionService->isGooglebot($request)) {
                // For Googlebot requests without summary, return the verdict without AI analysis
                return response()->json([
                    'verdict' => VerdictResource::make($verdict->load('court', 'people', 'organizations')),
                    'ai_analysis_blocked' => true,
                    'reason' => 'Googlebot request - AI analysis skipped to preserve API quota',
                ]);
            }
            
            // For regular users, generate AI analysis
            $this->summaryService->getAIAnalysisVerdict($verdict, $request);
        }

        return response()->json([
            'verdict' => VerdictResource::make($verdict->load('court', 'people', 'organizations', 'summary')),
        ]);
    }

    public function upvoteVerdictSummary(VerdictSummary $summary)
    {
        abort_if(!$summary, 404, 'Verdict summary not found');
        $summary->increment('upvotes');
        return response()->json(['message' => 'Upvoted successfully']);
    }

    public function downvoteVerdictSummary(VerdictSummary $summary)
    {
        abort_if(!$summary, 404, 'Verdict summary not found');
        $summary->increment('downvotes');
        return response()->json(['message' => 'Downvoted successfully']);
    }
}
