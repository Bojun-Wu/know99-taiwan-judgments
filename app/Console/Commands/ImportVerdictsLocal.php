<?php

namespace App\Console\Commands;

use App\Models\Verdict;
use App\Services\ImportVerdictServices\ImportVerdictService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Str;
use Symfony\Component\Finder\Finder;

class ImportVerdictsLocal extends Command
{
    protected $signature = 'verdict:import-local
                            {--path=storage/app/private/verdict_data : import 路徑（相對 project root 的路徑或絕對路徑）}
                            {--test : 測試模式，只處理部分資料 （使用 --divide-by 指定要處理的資料比例）}
                            {--divide-by=100 : 處理 1/divide-by 的資料}
                            {--fresh : 刪除所有現有資料}
                            {--fresh-seed : 刪除所有現有資料並執行 seeders}';
    protected $description = 'Import verdict data from local files';

    protected ImportVerdictService $importVerdictService;
    protected $stats = [
        'imported' => 0,
        'updated' => 0,
        'skipped' => 0,
        'errors' => [],
        'total' => 0
    ];

    public function __construct(ImportVerdictService $importVerdictService)
    {
        parent::__construct();
        $this->importVerdictService = $importVerdictService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('fresh') || $this->option('fresh-seed')) {
            $this->info('Run on fresh mode, clearing database and logs...');
            Process::run('echo "" > storage/logs/laravel.log');
            $this->call('migrate:fresh', ['--seed' => $this->option('fresh-seed')]);

            $this->newLine();
            $this->info('Flushing scout index...');
            $this->call('scout:flush', ['model' => Verdict::class]);
        }

        $path = $this->option('path');
        if (Str::startsWith($path, '/') || Str::contains($path, ':')) {
            $fullPath = $path;
        } else {
            $fullPath = base_path($path);
        }

        if (!file_exists($fullPath)) {
            $this->error("Path not found: {$fullPath}");
            return 1;
        }

        $progress = $this->output->createProgressBar();
        $progress->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%');

        $this->info('Importing verdicts from path...');
        $this->importFromDirectory($fullPath, $progress);
        $progress->finish();
        $this->newLine();
        $this->info('Import completed!');
        $this->displayStats();

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

    protected function importFromDirectory(string $path, $progress)
    {
        $finder = new Finder();
        $finder->files()->in($path);

        $totalFiles = iterator_count($finder);
        $progress->setMaxSteps($totalFiles);

        if ($totalFiles === 0) {
            $this->error("No files found in: {$path}");
            return;
        }

        $this->info("Found {$totalFiles} files to process.");
        if ($this->option('test')) {
            $this->info('Run on test mode, only process 1/' . $this->option('divide-by') . ' data.');
        }

        foreach ($finder as $file) {
            if ($this->option('test') ? fake()->numberBetween(1, $this->option('divide-by')) === 1 : true) {
                $result = $this->importVerdictService->importFile($file, $this->option('fresh') || $this->option('fresh-seed'));
                if ($result['status'] === 'error') {
                    $this->error($result['message']);
                    $this->stats['errors'][] = $result['message'];
                } else {
                    $this->stats[$result['status']]++;
                    $this->stats['total']++;
                }
            }

            $progress->advance();
        }
    }

    protected function displayStats()
    {
        $this->newLine();
        $this->info('Import Statistics:');
        $this->table(
            ['Status', 'Count'],
            [
                ['Imported', $this->stats['imported']],
                ['Updated', $this->stats['updated']],
                ['Skipped', $this->stats['skipped']],
                ['Total Processed', $this->stats['total']],
                ['Errors', count($this->stats['errors'])],
            ]
        );

        if (!empty($this->stats['errors'])) {
            $this->newLine();
            $this->warn('Errors encountered:');
            foreach ($this->stats['errors'] as $error) {
                $this->line(" - {$error}");
            }
            $this->newLine();
        }
    }
}
