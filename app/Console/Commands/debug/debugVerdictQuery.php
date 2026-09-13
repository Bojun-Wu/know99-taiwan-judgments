<?php

namespace App\Console\Commands\debug;

use App\Models\Verdict;
use Illuminate\Console\Command;
use Illuminate\Support\Benchmark;

class debugVerdictQuery extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:verdict-query
                            {--per-page=10 : 每頁筆數}
                            {--page=1 : 使用 paginate}
                            {--iterations=1 : 迭代次數}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test verdict query';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing paginate...');
        $this->info('Page: ' . $this->option('page'));
        $this->info('Iterations: ' . $this->option('iterations'));
        $this->newLine();

        Benchmark::dd([
            'paginate' => fn() => Verdict::latest('verdict_date')
                ->with('court')
                ->paginate($this->option('per-page'), ['*'], 'page', $this->option('page')),
            'fastPaginate' => fn() => Verdict::latest('verdict_date')
                ->with('court')
                ->fastPaginate($this->option('per-page'), ['*'], 'page', $this->option('page')),
        ], iterations: $this->option('iterations'));

        return 0;
    }
}
