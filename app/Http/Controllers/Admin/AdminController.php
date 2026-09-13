<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Court;
use App\Models\Verdict;
use App\Models\Organization;
use App\Models\Person;
use App\Models\VerdictView;
use App\Models\Post;
use App\Models\PostView;
use App\Services\VerdictService;
use App\Services\PostService;
use App\Http\Resources\VerdictResource;
use App\Models\VerdictSummary;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    protected VerdictService $verdictService;
    protected PostService $postService;

    public function __construct(VerdictService $verdictService, PostService $postService)
    {
        $this->verdictService = $verdictService;
        $this->postService = $postService;
    }

    public function dashboard()
    {
        // Basic statistics
        $stats = [
            'totalVerdicts' => Cache::rememberForever('verdicts-count', fn() => Verdict::count()),
            'totalVerdictSummaries' => Cache::remember('verdict-summaries-count', 3600, fn() => VerdictSummary::count()),
            'totalOrganizations' => Cache::remember('organizations-count', 3600, fn() => Organization::count()),
            'totalPeople' => Cache::remember('people-count', 3600, fn() => Person::count()),
            'totalPosts' => Cache::remember('posts-count', 3600, fn() => Post::count()),
            'totalCourts' => Cache::rememberForever('courts-count', fn() => Court::count()),
        ];

        // verdict view statistics
        $verdictViewStats = Cache::remember('verdict-view-stats', 3600, fn() => $this->getViewStats(VerdictView::class));

        // post view statistics
        $postViewStats = Cache::remember('post-view-stats', 3600, fn() => $this->getViewStats(PostView::class));

        // Trending data
        $trendingData = [
            'trendingVerdicts' => VerdictResource::collection($this->verdictService->getTrendingVerdicts(10)),
            'trendingKeywords' => $this->verdictService->getTrendingKeywords(30),
        ];

        // Recent visitors (unique IPs in last 24 hours)
        $recentVisitors = Cache::remember('recent-visitors', 3600, function () {
            $recentVisitors = VerdictView::select('ip_address', DB::raw('MAX(created_at) as last_visit'))
                ->where('created_at', '>=', now()->subDay())
                ->groupBy('ip_address')
                ->orderByDesc('last_visit')
                ->limit(50)
                ->get()
                ->toArray();

            return $recentVisitors;
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'trendingData' => $trendingData,
            'verdictViewStats' => $verdictViewStats,
            'postViewStats' => $postViewStats,
            'recentVisitors' => $recentVisitors,
        ]);
    }

    protected function getViewStats($model)
    {
        // verdict view statistics
        $viewStats = [
            'todayViews' => $model::where('created_at', '>=', now()->subDay())->count(),
            'yesterdayViews' => $model::where('created_at', '>=', now()->subDays(2))->where('created_at', '<', now()->subDay())->count(),
            'thisWeekViews' => $model::where('created_at', '>=', now()->subDays(7))->count(),
            'lastWeekViews' => $model::where('created_at', '>=', now()->subDays(14))->where('created_at', '<', now()->subDays(7))->count(),
            'thisMonthViews' => $model::where('created_at', '>=', now()->subDays(30))->count(),
            'lastMonthViews' => $model::where('created_at', '>=', now()->subDays(60))->where('created_at', '<', now()->subDays(30))->count(),
        ];

        // Calculate differences and percentages
        $viewStats['todayDiff'] = $viewStats['todayViews'] - $viewStats['yesterdayViews'];
        $viewStats['todayPercent'] = $viewStats['yesterdayViews'] > 0
            ? round((($viewStats['todayViews'] - $viewStats['yesterdayViews']) / $viewStats['yesterdayViews']) * 100, 1)
            : 100;

        $viewStats['weekDiff'] = $viewStats['thisWeekViews'] - $viewStats['lastWeekViews'];
        $viewStats['weekPercent'] = $viewStats['lastWeekViews'] > 0
            ? round((($viewStats['thisWeekViews'] - $viewStats['lastWeekViews']) / $viewStats['lastWeekViews']) * 100, 1)
            : 100;

        $viewStats['monthDiff'] = $viewStats['thisMonthViews'] - $viewStats['lastMonthViews'];
        $viewStats['monthPercent'] = $viewStats['lastMonthViews'] > 0
            ? round((($viewStats['thisMonthViews'] - $viewStats['lastMonthViews']) / $viewStats['lastMonthViews']) * 100, 1)
            : 100;

        return $viewStats;
    }
}
