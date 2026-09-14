<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\Person;
use App\Models\Verdict;
use App\Models\VerdictSummary;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VerdictSummaryService
{
    protected function getSystemPrompt(): string
    {
        return <<<EOT
        您是一位專業的臺灣判決書分析專家。請仔細閱讀判決書全文，並嚴格依照提供的 JSON schema 輸出資料。
        所有事實、金額、日期、關係與裁判結果都必須有判決書原文依據；不得臆測、補充未記載的資料，或輸出 schema 以外的說明。
        請特別區分中文索引資料與英文讀者摘要：`人名`、`機構名`、`關鍵字`、`摘要` 是繁體中文資料；`英文摘要` 則是供不懂中文的使用者閱讀的英文內容。
        找不到列表欄位內容時，請輸出空列表 `[]`。
        EOT;
    }

    protected function getUserPrompt(string $content): string
    {
        // 避免超過 Tokens per Minute 和 context length

        // 清理 content 中的空格
        $cleanedContent = Str::of($content)
            ->replace("　", " ")
            ->squish();

        // 超過上限的話裁切，並拼接後面 2000 字
        $processedContent = '';
        if ($cleanedContent->length() > 12000) {
            $processedContent = mb_substr($cleanedContent, 0, 10000);
            $processedContent .= "...";
            $processedContent .= mb_substr($cleanedContent, -2000);
        } else {
            $processedContent = $cleanedContent;
        }

        return <<<EOT
        請分析以下判決書全文，並根據我已提供的 JSON schema 填充對應的欄位。

        **欄位規則：**

        1. **`人名`（中文實體索引）**
           - 擷取判決書中明確提到的自然人姓名，包括但不限於原告、被告、上訴人、被上訴人、代表人、法定代理人、訴訟代理人（律師）、證人、鑑定人、法官、書記官等。

        2. **`機構名`（中文實體索引）**
           - 擷取明確出現的非政府組織、公司、商號、法人或其他民間機構名稱。
           - 排除政府機關與法院。保留原始中文名稱；若原文使用正式英文名稱，才保留該英文名稱。

        3. **`關鍵字`（中文關鍵字）**
           - 提取最能吸引使用者注意力、最具話題性、或最能概括判決書核心內容、爭議焦點或判決結果的的 3 到 5 個關鍵字或短語。

        4. **`摘要`（中文讀者）**
           - 以繁體中文、白話的方式，寫 1 至 10 句摘要。想像您正在跟一位沒有法律背景的朋友解釋這件事。

        5. **`英文摘要`（英文讀者）**
           - 以自然、清楚、非法律專業人士也能理解的英文，寫出與中文摘要等值的 1 至 10 句內容。
           - 中文姓名使用漢語拼音（Hanyu Pinyin）的英文拼寫。例如：`楊品薇` 寫成 `Yang Pin-wei`。
           - 中文組織名稱也應使用可讀的拼音或英文描述，例如 `全聯` 可寫為 `Quanlian`；如需要說明組織性質，可寫成 `Quanlian supermarket`。只有原文已明確提供正式英文名稱時，才使用該正式英文名稱。

        **判決書全文如下：**
        {$processedContent}
        EOT;
    }

    protected function getResponseSchema()
    {
        return [
            "title" => "判決書分析結果",
            "description" => "對判決書進行分析後提取的結構化資訊。",
            "type" => "object",
            "additionalProperties" => false,
            "properties" => [
                "人名" => [
                    "type" => "array",
                    "items" => [
                        "type" => "string"
                    ],
                    "description" => "判決書中提及的所有相關自然人姓名列表。",
                ],
                "機構名" => [
                    "type" => "array",
                    "items" => [
                        "type" => "string"
                    ],
                    "description" => "判決書中提及的所有非政府的機構、公司、法人單位等組織名稱列表。",
                ],
                "關鍵字" => [
                    "type" => "array",
                    "items" => [
                        "type" => "string"
                    ],
                    "description" => "最能吸引使用者注意力、最具話題性或最能概括判決書核心衝突點的關鍵字或短語列表。",
                ],
                "摘要" => [
                    "type" => "string",
                    "description" => "判決書的白話簡短摘要。",
                ],
                "英文摘要" => [
                    "type" => "string",
                    "description" => "供英文讀者閱讀的白話英文摘要。",
                ],
            ],
            "required" => ["人名", "機構名", "關鍵字", "摘要", "英文摘要"],
        ];
    }

    public function getAIAnalysisVerdict(Verdict $verdict): void
    {
        $apiKey = env('GROQ_SECRET_KEY');
        $model = env('GROQ_MODEL', 'qwen/qwen3.8-27b');

        if (!$apiKey) {
            throw new \Exception('GROQ_SECRET_KEY is not set');
        }

        $response = Http::withToken($apiKey)
            ->acceptJson()
            ->timeout(120)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $this->getSystemPrompt(),
                    ],
                    [
                        'role' => 'user',
                        'content' => $this->getUserPrompt($verdict->content),
                    ],
                ],
                'response_format' => [
                    'type' => 'json_schema',
                    'json_schema' => [
                        'name' => 'verdict_analysis',
                        'strict' => true,
                        'schema' => $this->getResponseSchema(),
                    ],
                ],
                'temperature' => 0,
            ],
            );
        if ($response->failed()) {
            Log::error('Failed to generate summary', [
                'verdict_id' => $verdict->id,
                'error' => $response->body(),
            ]);
            throw new \Exception('Failed to generate summary');
        }

        $analysisContent = $response->json('choices.0.message.content');
        $analysis = is_string($analysisContent)
            ? json_decode($analysisContent, true)
            : null;

        // check if the analysis is valid
        if (!isset($analysis['人名']) || !isset($analysis['機構名']) || !isset($analysis['關鍵字']) || !isset($analysis['摘要']) || !isset($analysis['英文摘要'])) {
            throw new \Exception('Invalid analysis');
        }

        // clean up existing relationships
        $peopleIds = $verdict->people()->pluck('id');
        $organizationIds = $verdict->organizations()->pluck('id');
        $verdict->update(['keywords' => []]);

        if (!$peopleIds->isEmpty()) {
            $verdict->people()->detach();

            // 將沒有關聯到 verdict 的 people 刪除
            $stillConnectedPeopleIds = DB::table('person_verdict')
                ->whereIn('person_id', $peopleIds)
                ->distinct()
                ->pluck('person_id');
            $orphanPeopleIds = $peopleIds->diff($stillConnectedPeopleIds);
            if ($orphanPeopleIds->isNotEmpty()) {
                Person::whereIn('id', $orphanPeopleIds)->delete();
            }
        }

        if (!$organizationIds->isEmpty()) {
            $verdict->organizations()->detach();

            // 將沒有關聯到 verdict 的 organizations 刪除
            $stillConnectedOrganizationIds = DB::table('organization_verdict')
                ->whereIn('organization_id', $organizationIds)
                ->distinct()
                ->pluck('organization_id');
            $orphanOrganizationIds = $organizationIds->diff($stillConnectedOrganizationIds);
            if ($orphanOrganizationIds->isNotEmpty()) {
                Organization::whereIn('id', $orphanOrganizationIds)->delete();
            }
        }

        // people 
        if (!empty($analysis['人名'])) {
            $peopleIds = [];
            foreach ($analysis['人名'] as $name) {
                $person = Person::firstOrCreate(['name' => $name]);
                $peopleIds[] = $person->id;
            }
            $verdict->people()->syncWithoutDetaching($peopleIds);
        }

        // organizations
        if (!empty($analysis['機構名'])) {
            $organizationIds = [];
            foreach ($analysis['機構名'] as $organization) {
                $organization = Organization::firstOrCreate(['name' => $organization]);
                $organizationIds[] = $organization->id;
            }
            $verdict->organizations()->syncWithoutDetaching($organizationIds);
        }

        // keywords
        $verdict->update(['keywords' => $analysis['關鍵字']]);

        // summary
        $newSummary = VerdictSummary::create([
            'verdict_id' => $verdict->id,
            'summary_zh' => $analysis['摘要'],
            'summary_en' => $analysis['英文摘要'],
        ]);
    }
}
