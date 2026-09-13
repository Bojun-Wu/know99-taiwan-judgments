<?php

namespace App\Services;

use App\Models\Court;
use App\Models\KeywordLog;
use App\Models\Verdict;
use App\Models\VerdictView;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VerdictService
{
    public function getPaginatedVerdicts(int $page = 1): LengthAwarePaginator
    {
        $verdicts_count = Cache::rememberForever('verdicts-count', fn() => Verdict::count());
        $ids = Cache::rememberForever('verdicts-pagination-ids-' . $page, fn() => Verdict::orderByDesc('judgement_date')
            ->limit(10)
            ->offset(($page - 1) * 10)
            ->pluck('id'));
        $verdicts = Verdict::whereIn('id', $ids)
            ->with('court')
            ->orderByDesc('judgement_date')
            ->orderByDesc('id')
            ->get();
        return new LengthAwarePaginator(
            items: $verdicts,
            total: $verdicts_count,
            perPage: 10,
            currentPage: $page,
            options: [
                'path' => request()->url(),
                'pageName' => 'page',
            ]
        );
    }

    public function searchVerdicts(array $params)
    {
        $query = Verdict::query()->with('court');

        $searchResultIds = Cache::rememberForever('verdicts-search-ids-' . $params['query'], function () use ($params) {
            return Verdict::search($params['query'])->options([
                'q' => '"' . $params['query'] . '"',
            ])->get()->pluck('id');
        });

        Log::info('Search verdicts', ['query' => $params['query'], 'count' => $searchResultIds->count(), 'ids' => $searchResultIds]);
        $query->whereIn('verdicts.id', $searchResultIds);

        if (!empty($params['year'])) {
            $query->where('year', $params['year']);
        }

        if (!empty($params['court'])) {
            $query->whereHas('court', function ($query) use ($params) {
                $query->where('name', $params['court']);
            });
        }

        if (!empty($params['type'])) {
            $query->where('type', $params['type']);
        }

        $aggregations = $this->getSearchAggregations($query);

        if (!empty($params['sortBy'])) {
            $query->orderBy('judgement_date', $params['sortBy']);
        }

        $paginator = $query->fastPaginate(10)->withQueryString();

        return [$paginator, $aggregations];
    }

    protected function getSearchAggregations($baseQuery)
    {
        // Get type aggregations
        $types = $baseQuery->clone()
            ->select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->orderByDesc('count')
            ->pluck('count', 'type');

        // Get court aggregations
        $courts = $baseQuery->clone()
            ->leftJoin('courts', 'verdicts.court_id', '=', 'courts.id')
            ->select('courts.name as court_name', DB::raw('count(*) as count'))
            ->groupBy('courts.name')
            ->orderByDesc('count')
            ->pluck('count', 'court_name');

        // Get year aggregations
        $years = $baseQuery->clone()
            ->select('year', DB::raw('count(*) as count'))
            ->groupBy('year')
            ->orderByDesc('count')
            ->pluck('count', 'year');

        return [
            'types' => $types,
            'courts' => $courts,
            'years' => $years,
        ];
    }

    public function getTrendingKeywords($limit = 10)
    {
        $trendingKeywords = Cache::remember('verdicts-search-trending-keywords-limit-' . $limit, 3600, function () use ($limit) {
            $keywords = KeywordLog::select('keyword', DB::raw('count(*) as count'))
                ->where('created_at', '>=', now()->subDays(30)) // 30天內的搜尋紀錄
                ->groupBy('keyword')
                ->orderByDesc('count')
                ->limit($limit)
                ->pluck('keyword');
            return $keywords;
        });

        return $trendingKeywords;
    }

    public function getTrendingVerdicts($limit = 10)
    {
        $trendingVerdictIds = Cache::remember('verdicts-trending-ids-limit-' . $limit, 3600, function () use ($limit) {
            $verdictIds = VerdictView::select('verdict_id', DB::raw('count(*) as count'))
                ->where('created_at', '>=', now()->subDays(30)) // 30天內的瀏覽紀錄
                ->groupBy('verdict_id')
                ->orderByDesc('count')
                ->limit($limit)
                ->pluck('verdict_id');
            return $verdictIds;
        });

        return Verdict::whereIn('id', $trendingVerdictIds)->with('court', 'summary')->get();
    }
}
