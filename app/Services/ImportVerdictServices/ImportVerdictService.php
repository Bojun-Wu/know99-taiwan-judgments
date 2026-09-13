<?php

namespace App\Services\ImportVerdictServices;

use Illuminate\Support\Str;
use App\Models\Verdict;
use App\Models\Court;
use App\Models\Person;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ImportVerdictService
{
    protected $verdictTypes = [
        '憲法' => '憲法',
        '民事' => '民事',
        '刑事' => '刑事',
        '--刑事補償' => '刑事',
        '行政' => '行政',
        '--訴願決定' => '行政',
        '-職務法庭' => '懲戒',
        '-懲戒法庭' => '懲戒',
        '其他' => '其他',
    ];

    public function importFile($file, $fresh = false)
    {
        try {
            $fileName = $file->getFilename();
            $directoryName = Str::of(dirname($file->getRealPath()))->replace('\\', '/')->explode('/')->last();

            $data = $this->parseVerdict($file->getContents());
            if (!$data) {
                return ['status' => 'error', 'message' => "Failed to parse JSON from file: {$fileName}"];
            }

            $existingVerdict = $fresh ? null : Verdict::where('verdict_id', $data['verdict_id'])->first();

            if (!$existingVerdict) {
                // check which case type is the directory name ending with
                $dirEnding = '其他';
                $type = '其他';
                foreach ($this->verdictTypes as $key => $value) {
                    if (Str::of($directoryName)->endsWith($key)) {
                        $type = $value;
                        $dirEnding = $key;
                        break;
                    }
                }

                $courtName = Str::of($directoryName)->beforeLast($dirEnding);

                // logging
                $verdictUrl = config('app.url') . "/verdicts/{$data['verdict_id']}";
                Log::info("Importing verdict:
                    url: {$verdictUrl}
                    path: {$file->getPath()}
                    verdict id: {$data['verdict_id']}
                    for court: {$courtName}
                    type: {$type}
                ");

                $newVerdict = Verdict::create(array_merge($data, [
                    'court_id' => Court::firstOrCreate(['name' => $courtName])->id,
                    'type' => $type,
                ]));

                return ['status' => 'imported'];
            } else {
                $newContentHash = md5($data['content']);
                $existingContentHash = md5($existingVerdict->content);

                if ($newContentHash !== $existingContentHash) {
                    $existingVerdict->update($data);
                    return ['status' => 'updated'];
                } else {
                    return ['status' => 'skipped'];
                }
            }
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => "Error importing file {$file}: " . $e->getMessage()];
        }
    }

    protected function parseVerdict($verdict)
    {
        $data = json_decode($verdict, true);

        return [
            'verdict_id' => Str::of($data['JID'])->replace(',', '-'),
            'year' => $data['JYEAR'],
            'category' => $data['JCASE'],
            'number' => intval($data['JNO']),
            'title' => $data['JTITLE'],
            'content' => $data['JFULL'],
            'judgement_date' => Carbon::createFromFormat('Ymd', $data['JDATE']),
        ];
    }

    protected function extractJudge($content): array
    {
        $judges = [];
        $reversedLines = array_reverse(explode("\r\n", $content));
        foreach ($reversedLines as $line) {
            // 去掉空格和全形空格
            $trimmedLine = Str::of($line)->trim()->replace([' ', '　'], '');
            // 將全形空格替換為單空格
            $normalizedLine = Str::of($line)->replace('　', ' ');

            // 法官
            if ((
                $trimmedLine->contains(['法官', '審判長法官', '司法事務官']) &&
                // 前面有空格或後面有空格
                $normalizedLine->contains([' 法', ' 審', '法 ', '官 ']) &&
                // 確保不是在句子中
                $this->isPureChinese($trimmedLine)
            )) {
                $extractedJudge = '';
                if ($trimmedLine->contains('法官')) $extractedJudge = $trimmedLine->afterLast('法官');
                if ($trimmedLine->contains('司法事務官')) $extractedJudge = $trimmedLine->afterLast('司法事務官');
                if (mb_strlen($extractedJudge) > 0 && mb_strlen($extractedJudge) <= 4) $judges[] = $extractedJudge;
            }

            // 委員
            if (
                $trimmedLine->contains(['委員', '主席委員']) &&
                $normalizedLine->contains([' 委', ' 主', '員 ']) &&
                $this->isPureChinese($trimmedLine, ['委員會'])
            ) {
                $extractedJudge = $trimmedLine->afterLast('委員');
                if (mb_strlen($extractedJudge) > 0 && mb_strlen($extractedJudge) <= 4) $judges[] = $extractedJudge;
            }

            // 評事
            if (
                $trimmedLine->contains(['評事', '審判長評事']) &&
                $normalizedLine->contains([' 評', ' 審', '事 ']) &&
                $this->isPureChinese($trimmedLine)
            ) {
                $extractedJudge = $trimmedLine->afterLast('評事');
                if (mb_strlen($extractedJudge) > 0 && mb_strlen($extractedJudge) <= 4) $judges[] = $extractedJudge;
            }
        }
        return array_unique($judges);
    }

    protected function extractClerk($content): string
    {
        $reversedLines = array_reverse(explode("\r\n", $content));

        foreach ($reversedLines as $line) {
            $trimmedLine = Str::of($line)->trim()->replace([' ', '　'], '');
            if ($trimmedLine->startsWith(['書記官', '法院書記官'])) {
                $clerk = $trimmedLine->afterLast('書記官');
                if (mb_strlen($clerk) > 0 && mb_strlen($clerk) <= 5) return $clerk;
            }
        }

        return '';
    }

    protected function isPureChinese($string, $exclude = [])
    {
        return preg_match('/^[\p{Han}]+$/u', $string) && !Str::of($string)->contains($exclude);
    }
}
