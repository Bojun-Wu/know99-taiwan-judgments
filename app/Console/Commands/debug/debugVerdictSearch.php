<?php

namespace App\Console\Commands\debug;

use App\Models\Verdict;
use Illuminate\Console\Command;
use Illuminate\Support\Benchmark;
use Illuminate\Support\Str;

class debugVerdictSearch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:verdict-search
                            {--keyword= : The keyword to search for}
                            {--exact : Whether to use exact search}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $keyword = $this->option('keyword');
        // if (!$keyword) {
        //     $this->error('Please provide a keyword');
        //     return;
        // }

        [$result, $duration] = Benchmark::value(function () {
            return Verdict::search('賴*羽')->options([
                'query_by' => 'content',
            ])->get();
        });
        [$result2, $duration2] = Benchmark::value(function () {
            return Verdict::whereLike('content', '賴_羽')->get();
        });

        dump($result->count(), $duration);
        $ids = [];
        foreach ($result as $item) {
            $ids[] = $item->id;
        }
        dump($ids);
        
        dump($result2->count(), $duration2);
        $ids2 = [];
        foreach ($result2 as $item) {
            $ids2[] = $item->id;
        }
        dump($ids2);
    }
}
