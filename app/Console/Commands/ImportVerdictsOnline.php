<?php

namespace App\Console\Commands;

use App\Models\Verdict;
use App\Services\ImportVerdictServices\DownloadVerdictService;
use App\Services\ImportVerdictServices\ImportVerdictService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Finder\Finder;

class ImportVerdictsOnline extends Command
{
    protected $signature = 'verdict:import-online
                            {--shuffle : 隨機處理資料}
                            {--fresh : 刪除所有現有資料}
                            {--fresh-seed : 刪除所有現有資料並執行 seeders}
                            {--from= : 從指定月份開始處理(包含)，格式為 YYYY-MM}
                            {--to= : 處理到指定月份(包含)，格式為 YYYY-MM}
                            {--temp-dir=app/private/temp : 暫存資料夾（相對 storage/ 的路徑）}
                            {--test : 測試模式，只處理部分資料 （使用 --divide-by 指定要處理的資料比例）}
                            {--divide-by=100 : 處理 1/divide-by 的資料}
                            {--clear-temp-dir : 是否在匯入完成後刪除下載的判決書資料}';
    protected $description = 'Import verdict data from the website';

    protected ImportVerdictService $importVerdictService;
    protected DownloadVerdictService $downloadVerdictService;
    protected $token = null;

    public function __construct(ImportVerdictService $importVerdictService, DownloadVerdictService $downloadVerdictService)
    {
        parent::__construct();
        $this->importVerdictService = $importVerdictService;
        $this->downloadVerdictService = $downloadVerdictService;
    }

    public function handle()
    {
        // 刪除現有資料
        if ($this->option('fresh') || $this->option('fresh-seed')) {
            $this->newLine();
            $this->info('Run on fresh mode, clearing database and logs...');
            Process::run('echo "" > storage/logs/laravel.log');
            $this->call('migrate:fresh', ['--seed' => $this->option('fresh-seed')]);

            $this->newLine();
            $this->info('Flushing scout index...');
            $this->call('scout:flush', ['model' => Verdict::class]);
        }

        // get token
        $this->newLine();
        $this->info('Getting token...');
        $this->token = $this->downloadVerdictService->getToken();
        $this->info('Got token!');

        // get dataset
        $this->newLine();
        $this->info('Getting dataset...');
        $dataset = $this->downloadVerdictService->getVerdictDataset($this->token);
        $this->info('Got dataset!');

        if ($this->option('shuffle')) {
            $this->newLine();
            $this->info('Run on shuffle mode, dataset will be shuffled');
            shuffle($dataset);
        }
        if ($this->option('from')) {
            try {
                $from = Carbon::createFromFormat('Y-m', $this->option('from'));
                if ($from->isFuture()) {
                    $this->error('請輸入過去的月份');
                    return 1;
                }
            } catch (\Exception $e) {
                $this->error('請輸入正確的月份格式，例如 2024-01');
                return 1;
            }
            $this->newLine();
            $this->info('資料將會從 ' . $this->option('from') . ' 開始處理');
            foreach ($dataset as $key => $verdict) {
                try {
                    $verdictDate = Carbon::createFromFormat('Ym', substr($verdict['title'], 0, 6));
                    if ($verdictDate->isBefore($from)) {
                        unset($dataset[$key]);
                    }
                } catch (\Exception $e) {
                    unset($dataset[$key]);
                    $this->info('Error: ' . $verdict['title'] . ' ' . $e->getMessage());
                }
            }
        }
        if ($this->option('to')) {
            try {
                $to = Carbon::createFromFormat('Y-m', $this->option('to'));
                if ($to->isFuture()) {
                    $this->error('請輸入過去的月份');
                    return 1;
                }
            } catch (\Exception $e) {
                $this->error('請輸入正確的月份格式，例如 2024-01');
                return 1;
            }
            $this->newLine();
            $this->info('資料將會處理到 ' . $this->option('to') . ' 結束');
            foreach ($dataset as $key => $verdict) {
                try {
                    $verdictDate = Carbon::createFromFormat('Ym', substr($verdict['title'], 0, 6));
                    if ($verdictDate->isAfter($to)) {
                        unset($dataset[$key]);
                    }
                } catch (\Exception $e) {
                    unset($dataset[$key]);
                    $this->info('Error: ' . $verdict['title'] . ' ' . $e->getMessage());
                }
            }
        }

        $this->clearTempDir();

        $this->newLine();
        $this->info('Importing verdicts...');
        $this->importVerdicts($dataset);
        $this->info('Imported verdicts!');

        if ($this->option('clear-temp-dir')) {
            $this->clearTempDir();
        }

        $this->newLine();
        $this->info('Generating sitemap...');
        $this->call('sitemap:generate', ['--verdicts' => true]);
        $this->info('Sitemap generated!');

        $this->newLine();
        $this->info('Clearing cache...');
        $this->call('cache:clear');
        $this->info('Cache cleared!');

        $this->newLine();
        $this->info('Import completed!');

        return 0;
    }

    protected function importVerdicts($dataset)
    {
        $tempDir = storage_path($this->option('temp-dir'));
        $progress = 0;
        foreach ($dataset as $verdict) {
            $progress++;
            $this->newLine(2);
            $this->info('Importing verdict ' . $progress . ' of ' . count($dataset) . '...');

            try {
                // download verdict
                $this->info('Downloading verdict ' . $verdict['title'] . '...');
                $this->downloadVerdictService->setOutput($this->output);
                $this->downloadVerdictService->downloadVerdict($verdict, $this->token, $tempDir);

                // unzip verdict
                $this->info('Unzipping verdict ' . $verdict['title'] . '...');
                $path = $this->downloadVerdictService->unzipVerdict($verdict, $tempDir);

                // import verdict
                $this->info('Importing verdict ' . $verdict['title'] . '...');
                $this->importVerdict($path);
            } catch (\Exception $e) {
                $this->error('Failed to import verdict ' . $verdict['title'] . ': ' . $e->getMessage());
            }
        }
    }

    protected function importVerdict($path)
    {
        $stats = [
            'imported' => 0,
            'updated' => 0,
            'skipped' => 0,
            'errors' => [],
            'total' => 0
        ];
        $subProgress = $this->output->createProgressBar();
        $subProgress->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%');

        $finder = new Finder();
        $finder->files()->in($path)->name('*.json');

        $totalFiles = iterator_count($finder);
        $subProgress->setMaxSteps($totalFiles);

        if ($totalFiles === 0) {
            $this->error('No JSON files found in unzipped directory' . $path);
            return;
        }

        $this->info("Found {$totalFiles} files to process.");
        if ($this->option('test')) {
            $this->info('Run on test mode, only process 1/' . $this->option('divide-by') . ' data.');
        }

        foreach ($finder as $file) {
            if ($this->option('test') ? fake()->numberBetween(1, $this->option('divide-by')) == 1 : true) {
                $result = $this->importVerdictService->importFile($file, $this->option('fresh') || $this->option('fresh-seed'));
                if ($result['status'] === 'error') {
                    $this->error($result['message']);
                    $stats['errors'][] = $result['message'];
                } else {
                    $stats[$result['status']]++;
                    $stats['total']++;
                }
            }
            $subProgress->advance();
        }
        $subProgress->finish();
        $this->displayStats($stats);
    }

    protected function displayStats($stats)
    {
        $this->newLine();
        $this->info('Import Statistics:');
        $this->table(
            ['Status', 'Count'],
            [
                ['Imported', $stats['imported']],
                ['Updated', $stats['updated']],
                ['Skipped', $stats['skipped']],
                ['Total Processed', $stats['total']],
                ['Errors', count($stats['errors'])],
            ]
        );

        if (!empty($stats['errors'])) {
            $this->newLine();
            $this->warn('Errors encountered:');
            foreach ($stats['errors'] as $error) {
                $this->line(" - {$error}");
            }
            $this->newLine();
        }
    }

    protected function clearTempDir()
    {
        $this->newLine();
        $this->info('Clearing temp directory...');
        $tempDir = storage_path($this->option('temp-dir'));
        if (file_exists($tempDir)) {
            $result = File::deleteDirectory($tempDir);
            if ($result) {
                $this->info('Temp directory cleared successfully!');
            } else {
                $this->error('Failed to clear temp directory: ' . $tempDir);
            }
        } else {
            $this->info('Temp directory not found: ' . $tempDir);
        }
    }
}
