<?php

namespace App\Console\Commands\debug;

use App\Models\Verdict;
use Illuminate\Console\Command;

class debugScoutReload extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:scout-reload
                            {--model=Verdict : The model to reload}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reload scout';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (config('scout.driver') === 'meilisearch') {
            $this->call('scout:sync-index-settings');
        }
        $this->call('scout:flush', ['model' => 'App\Models\\' . $this->option('model')]);
        $this->call('scout:import', ['model' => 'App\Models\\' . $this->option('model')]);
    }
}
