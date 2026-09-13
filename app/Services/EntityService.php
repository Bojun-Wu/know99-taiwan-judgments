<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Person;
use App\Models\Organization;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class EntityService
{
    /**
     * Search entities
     * 
     * @param string|null $query
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function searchEntities(?string $query, int $perPage = 12): LengthAwarePaginator
    {
        // --- 處理 People 搜尋和排序分數 ---
        $peopleSearchResults = [];
        if ($query) {
            // 使用 raw() 獲取原始搜尋結果，包含 text_match 分數
            $peopleSearchResults = Cache::remember('people-search-results-' . $query, 3600, function () use ($query) {
                $rawResults = Person::search($this->getSearchQuery($query))->raw();
                $results = [];
                foreach ($rawResults['hits'] as $hit) {
                    $results[] = [
                        'id' => (int) $hit['document']['id'],
                        'score' => (int) $hit['text_match'] // text_match 是 Typesense 的關聯分數
                    ];
                }
                return $results;
            });
        }
        $peopleIds = array_column($peopleSearchResults, 'id');

        // --- 處理 Organizations 搜尋和排序分數 ---
        $orgSearchResults = [];
        if ($query) {
            $orgSearchResults = Cache::remember('organizations-search-results-' . $query, 3600, function () use ($query) {
                $rawResults = Organization::search($this->getSearchQuery($query))->raw();
                $results = [];
                foreach ($rawResults['hits'] as $hit) {
                    $results[] = [
                        'id' => (int) $hit['document']['id'],
                        'score' => (int) $hit['text_match']
                    ];
                }
                return $results;
            });
        }
        $organizationIds = array_column($orgSearchResults, 'id');


        // 步驟 1: 預先計算 People 的 Verdicts 計數
        $peopleCounts = DB::table('person_verdict')
            ->select('person_id', DB::raw('count(*) as verdicts_count'))
            ->groupBy('person_id');

        // 步驟 2: 建立 Person 的查詢，使用 JOIN 代替子查詢
        $peopleQuery = DB::table('people')
            ->joinSub($peopleCounts, 'counts', function ($join) {
                $join->on('people.id', '=', 'counts.person_id');
            })
            ->select(
                'people.id',
                'people.name',
                DB::raw("'person' as type"),
                'people.created_at',
                'counts.verdicts_count'
            ); // verdicts_count 現在來自 JOIN 的結果

        if ($query) {
            $peopleQuery->whereIn('people.id', $peopleIds);
            // 透過 JOIN 將分數帶入查詢
            $this->joinScores($peopleQuery, $peopleSearchResults, 'people.id');
        } else {
            // 如果沒有搜尋詞，給一個預設分數以便排序
            $peopleQuery->selectRaw('0 as search_score');
        }


        // 步驟 3: 預先計算 Organizations 的 Verdicts 計數
        $organizationCounts = DB::table('organization_verdict')
            ->select('organization_id', DB::raw('count(*) as verdicts_count'))
            ->groupBy('organization_id');

        // 步驟 4: 建立 Organization 的查詢，使用 JOIN
        $organizationsQuery = DB::table('organizations')
            ->joinSub($organizationCounts, 'counts', function ($join) {
                $join->on('organizations.id', '=', 'counts.organization_id');
            })
            ->select(
                'organizations.id',
                'organizations.name',
                DB::raw("'organization' as type"),
                'organizations.created_at',
                'counts.verdicts_count'
            );

        if ($query) {
            $organizationsQuery->whereIn('organizations.id', $organizationIds);
            $this->joinScores($organizationsQuery, $orgSearchResults, 'organizations.id');
        } else {
            $organizationsQuery->selectRaw('0 as search_score');
        }

        // 使用 UNION ALL 合併兩個查詢
        // 使用 unionAll 而非 union，因為來源不同，不可能有重複列，可以省去去重的效能開銷
        // 注意：這裡不再需要 WHERE verdicts_count > 0，因為 INNER JOIN 已經隱含了這個過濾
        $combinedQuery = $peopleQuery->unionAll($organizationsQuery);

        // 對合併後的結果進行排序和分頁
        // 注意：ORDER BY 必須在 UNION 之後進行
        // 我們需要從一個派生表（derived table）中 select 才能排序
        $finalQuery = DB::table($combinedQuery, 'merged_entities');

        if ($query) {
            // 如果有搜尋，優先按關聯性分數降序排序，分數相同再按時間降序
            $finalQuery->orderBy('search_score', 'desc')->orderBy('created_at', 'desc');
        } else {
            // 如果沒有搜尋，只按時間降序排序
            $finalQuery->orderBy('created_at', 'desc');
        }

        $entities = $finalQuery->paginate($perPage)->withQueryString();

        return $entities;
    }

    /**
     * 使用 VALUES 子句和 JOIN 將搜尋分數注入查詢。
     *
     * @param \Illuminate\Database\Query\Builder $query
     * @param array $scores // [['id' => 1, 'score' => 100], ['id' => 5, 'score' => 90]]
     * @param string $joinColumn // e.g., 'people.id'
     */
    protected function joinScores($query, array $scores, string $joinColumn)
    {
        if (empty($scores)) {
            // 如果搜尋結果為空，為了讓 whereIn 生效，給一個不可能的分數
            $query->selectRaw('-1 as search_score');
            return;
        }

        // 構建 (id, score), (id, score), ... 這樣的 VALUES 字串
        $values = collect($scores)->map(function ($item) {
            return sprintf("(%d, %d)", $item['id'], $item['score']);
        })->implode(', ');

        // 構建一個可以 JOIN 的臨時表
        // (VALUES (...)) AS scores_table(id, search_score)
        $scoresTable = DB::raw("(VALUES {$values}) AS scores_table(id, search_score)");

        $query->join($scoresTable, 'scores_table.id', '=', $joinColumn)
            ->addSelect('scores_table.search_score'); // 將分數加入 select
    }

    protected function getSearchQuery(string $query)
    {
        // 將 ○ 轉換為 wildcard(*)
        return preg_replace('/○+/', '*', $query);
    }
}
