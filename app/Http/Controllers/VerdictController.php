<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchVerdictRequest;
use App\Http\Resources\VerdictResource;
use App\Models\Verdict;
use App\Services\VerdictService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Jobs\LogVerdictView;
use App\Jobs\LogSearchKeyword;
use App\Models\Post;
use App\Http\Resources\PostResource;
use App\Services\PostService;

class VerdictController extends Controller
{
    protected VerdictService $verdictService;
    protected PostService $postService;

    public function __construct(VerdictService $verdictService, PostService $postService)
    {
        $this->verdictService = $verdictService;
        $this->postService = $postService;
    }

    public function home(Request $request)
    {
        return Inertia::render('Home', [
            'trendingKeywords' => $this->verdictService->getTrendingKeywords(10),
            'trendingVerdicts' => VerdictResource::collection($this->verdictService->getTrendingVerdicts(6)),
            'recentPosts' => PostResource::collection($this->postService->getRecentPosts(6)),
        ]);
    }

    public function index(Request $request)
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
        ]);
        $page = $request->query('page', 1);

        return Inertia::render('Verdicts/VerdictIndex', [
            'verdicts' => VerdictResource::collection($this->verdictService->getPaginatedVerdicts($page)),
        ]);
    }

    public function trending(Request $request)
    {
        return Inertia::render('Verdicts/VerdictTrending', [
            'verdicts' => VerdictResource::collection($this->verdictService->getTrendingVerdicts(10)),
        ]);
    }

    public function show(Verdict $verdict, Request $request)
    {
        // Dispatch the job to log the view asynchronously
        LogVerdictView::dispatch(
            $verdict->id,
            $request->ip(),
            $request->session()->getId()
        );

        $verdict->load('court', 'people', 'organizations', 'summary');
        $summary = $verdict->summary;

        // determine if summary need to be regenerated
        if ($summary) {
            $isEnglish = app()->getLocale() === 'en';
            $upvotes = $isEnglish ? $summary->upvotes_en : $summary->upvotes_zh;
            $downvotes = $isEnglish ? $summary->downvotes_en : $summary->downvotes_zh;
            $summaryTotalVotes = $upvotes + $downvotes;
            if ($summaryTotalVotes >= 3 && $downvotes > $upvotes) {
                $summary->update([
                    'status' => 'deprecated',
                ]);
            }
        }

        return Inertia::render('Verdicts/VerdictShow', [
            'verdict' => VerdictResource::make($verdict),
        ]);
    }

    public function search(Request $request, SearchVerdictRequest $searchVerdictRequest)
    {
        $validatedParams = $searchVerdictRequest->validated();
        [$verdicts, $aggregations] = $this->verdictService->searchVerdicts($validatedParams);

        // Log the search keyword asynchronously if there are results
        if ($verdicts->count() > 0) {
            LogSearchKeyword::dispatch(
                $validatedParams['query'],
                $request->ip(),
                $request->session()->getId()
            );
        }

        return Inertia::render('Verdicts/VerdictSearch', [
            'query' => [
                ...$validatedParams,
                'sortBy' => $validatedParams['sortBy'] === 'desc' ? null : $validatedParams['sortBy'],
                'page' => $validatedParams['page'] == 1 ? null : $validatedParams['page'],
            ],
            'verdicts' => VerdictResource::collection($verdicts),
            'aggregations' => $aggregations,
        ]);
    }
}
