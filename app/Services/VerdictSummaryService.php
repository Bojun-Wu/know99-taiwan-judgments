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
        您是一位專業的 AI 法律文件分析專家。
        您的核心任務是仔細閱讀使用者提供的判決書全文，並根據使用者明確提供的 JSON schema 提取結構化的資訊。
        請確保所有提取的資訊極度準確、完整，並且嚴格來源於判決書原文。
        您必須嚴格按照使用者提供的 JSON schema 的結構和欄位要求來組織您的輸出。
        避免在輸出中包含任何 schema 未定義的額外信息或解釋性文字，除非 schema 的某個字段明確要求如此。
        如果對於某個列表類型的欄位（如人名、機構名、關鍵字）在判決書中找不到任何對應內容，請確保該欄位的值為一個空列表 `[]`。
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

        **關於 schema 中各欄位的填充指南：**

        1.  **`人名`:**
            *   **提取目標：** 判決書中明確提及的所有自然人姓名。
            *   **包含範圍：** 包括但不限於原告、被告、上訴人、被上訴人、代表人、法定代理人、訴訟代理人（律師）、證人、鑑定人、法官、書記官等。
            *   **注意事項：** 僅提取明確的自然人姓名。若無，則返回空列表 `[]`。

        2.  **`機構名`:**
            *   **提取目標：** 判決書中提及的所有**非政府**的機構、公司、法人單位等組織名稱。
            *   **排除範圍：** 此列表不應包含政府機關（例如：內政部、XX市政府、XX縣警察局等）或法院本身（例如：XX地方法院、XX高等法院等）。
            *   **注意事項：** 僅提取明確的組織機構名稱。若無，則返回空列表 `[]`。

        3.  **`關鍵字`:**
            *   **提取目標：** 提取最能吸引使用者注意力、最具話題性、或最能概括判決書核心內容、爭議焦點或判決結果的的 3 到 5 個關鍵字或短語。
            *   **內容導向：** 應能幫助使用者快速抓住判決書的亮點。

        4.  **`摘要`:**
            *   **長度要求：** 生成一段 1 到 10 句話的精煉摘要。
            *   **風格要求：** 請使用**白話、口語化**的方式撰寫。想像您正在跟一位沒有法律背景的朋友解釋這件事。

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
                    "description" => "判決書的簡短摘要。",
                ],
            ],
            "required" => ["人名", "機構名", "關鍵字", "摘要"],
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
        if (!isset($analysis['人名']) || !isset($analysis['機構名']) || !isset($analysis['關鍵字']) || !isset($analysis['摘要'])) {
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
            'summary' => $analysis['摘要'],
        ]);
    }
}
