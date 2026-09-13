<?php

namespace App\Console\Commands\debug;

use App\Models\Person;
use App\Models\Organization;
use Illuminate\Console\Command;

class debugRemoveUnusedEntity extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:remove-unused-entity';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove unused entity';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $people = Person::whereDoesntHave('verdicts');
        $organizations = Organization::whereDoesntHave('verdicts');

        $this->info('People: ' . $people->count());
        $this->info('Organizations: ' . $organizations->count());
        $this->info('Total: ' . ($people->count() + $organizations->count()));

        $people->delete();
        $organizations->delete();

        $this->info('Done');
    }
}
