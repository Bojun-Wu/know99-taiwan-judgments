<?php

namespace App\Services\ImportVerdictServices;

use Illuminate\Support\Str;
use Illuminate\Console\OutputStyle;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;

class DownloadVerdictService
{
    protected ?OutputStyle $output = null;

    public function setOutput(OutputStyle $output): void
    {
        $this->output = $output;
    }

    public function getToken(): string
    {
        if (!env('JUDICIAL_API_USERNAME') || !env('JUDICIAL_API_PASSWORD')) {
            throw new \Exception('JUDICIAL_API_USERNAME or JUDICIAL_API_PASSWORD is not set');
        }

        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->withOptions(['verify' => false])
            ->withBody(json_encode([
                'memberAccount' => env('JUDICIAL_API_USERNAME'),
                'pwd' => env('JUDICIAL_API_PASSWORD')
            ]))->post('https://opendata.judicial.gov.tw/api/MemberTokens');

        if (!$response->successful()) {
            throw new \Exception('Failed to get API token');
        }
        return $response->json()['token'];
    }

    public function getVerdictDataset($token): array
    {
        $response = Http::withToken($token, 'Bearer')
            ->withOptions(['verify' => false])
            ->get('https://opendata.judicial.gov.tw/data/api/rest/categories/051/resources');

        if (!$response->successful()) {
            throw new \Exception('Failed to get verdict dataset');
        }
        return $response->json();
    }

    public function downloadVerdict($verdict, $token, $tempDir): void
    {
        $fileSetId = $verdict['filesets'][0]['fileSetId'];
        $resourceFormat = $verdict['filesets'][0]['resourceFormat'];
        $parsedFileName = $this->parseFileName($verdict['title']);

        if ($resourceFormat !== 'rar' && $resourceFormat !== 'zip' && $resourceFormat !== 'RAR') {
            throw new \Exception('Unsupported resource format: ' . $resourceFormat);
        }

        $url = "https://opendata.judicial.gov.tw/api/FilesetLists/{$fileSetId}/file";
        $outputPath = $tempDir . "/rar/{$parsedFileName}.{$resourceFormat}";

        if (file_exists($outputPath)) return;

        // Ensure the directory exists
        $directory = dirname($outputPath);
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }

        // Open the file for writing
        $fileHandle = fopen($outputPath, 'w');
        if ($fileHandle === false) {
            throw new \RuntimeException("Failed to open file for writing: $outputPath");
        }

        try {

            $progressBar = $this->output->createProgressBar();
            $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%');

            // Stream the response
            $response = Http::withOptions([
                'stream' => true,
                'verify' => false,
                'progress' => function ($downloadTotal, $downloadedBytes) use ($progressBar) {
                    if (!$progressBar->getMaxSteps()) {
                        $progressBar->setMaxSteps($downloadTotal);
                    }
                    $progressBar->setProgress($downloadedBytes);
                }
            ])
                ->withToken($token, 'Bearer')
                ->get($url);

            while (!$response->getBody()->eof()) {
                fwrite($fileHandle, $response->getBody()->read(4096));
            }

            // Finish the progress bar
            $progressBar->finish();
            $this->output->writeln('');
        } catch (\Exception $e) {
            // Handle any errors
            throw new \RuntimeException("Failed to stream response: " . $e->getMessage());
        } finally {
            // Close the file handle
            fclose($fileHandle);
        }

        return;
    }

    public function unzipVerdict($verdict, $tempDir): string
    {
        $resourceFormat = $verdict['filesets'][0]['resourceFormat'];
        $fileName = $this->parseFileName($verdict['title']);
        $rarPath = $tempDir . "/rar/{$fileName}.{$resourceFormat}";
        $outputDir = $tempDir . "/data";
        $outputPath = $tempDir . "/data/" . $fileName;

        if (file_exists($outputPath)) return $outputPath;

        // Ensure the directory exists
        $directory = dirname($outputPath);
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }

        // linux
        $result = Process::run("unar -f -o {$outputDir} {$rarPath}");
        // windows
        // $result = Process::run("unrar x {$rarPath} {$outputDir}");

        if ($result->failed()) {
            throw new \Exception('Failed to unzip verdict: ' . $result->errorOutput());
        }

        return $outputPath;
    }

    protected function parseFileName($fileName)
    {
        $newFileName = '';
        foreach (mb_str_split($fileName) as $word) {
            if (!Str::of($word)->isAscii()) break;
            $newFileName .= $word;
        }
        return $newFileName;
    }
}
