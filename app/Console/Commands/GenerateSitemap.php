<?php

namespace App\Console\Commands;

use App\Models\Verdict;
use App\Services\VerdictService;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\SitemapIndex;
use Spatie\Sitemap\Tags\Sitemap as SitemapTag;
use Spatie\Sitemap\Tags\Url;
use App\Models\Post;
use App\Models\Person;
use App\Models\Organization;

class GenerateSitemap extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate
                            {--path=public : 輸出路徑（相對 project root 的路徑或絕對路徑）}
                            {--verdicts : 重新產生 verdicts sitemap}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $sitemapFolder = $this->option('path') ? base_path($this->option('path')) : public_path();
        // check if path exists
        if (!file_exists($sitemapFolder)) {
            $this->error('Path not found: ' . $sitemapFolder);
            return 1;
        }

        // remove all sitemap files if verdicts option is set
        if (file_exists($sitemapFolder . '/sitemaps') && $this->option('verdicts')) {
            File::deleteDirectory($sitemapFolder . '/sitemaps');
        }

        // check if sitemap folder exists
        if (!file_exists($sitemapFolder . '/sitemaps')) {
            mkdir($sitemapFolder . '/sitemaps', 0777, true);
        }

        $sitemapFiles = [];
        $chunkSize = 2500;

        // general
        $this->info('Generating general sitemap...');
        Sitemap::create()
            ->add(Url::create('/')->setLastModificationDate(now()))
            ->add(Url::create('/trending')->setLastModificationDate(now()))
            ->add(Url::create('/verdicts')->setLastModificationDate(now()))
            ->add(Url::create('/posts')->setLastModificationDate(now()))
            ->add(Url::create('/entities')->setLastModificationDate(now()))
            ->add(Url::create('/about')->setLastModificationDate(now()))
            ->writeToFile($sitemapFolder . '/sitemaps/general.xml');
        $sitemapFiles[] = ['file' => 'sitemaps/general.xml', 'type' => 'general'];

        // verdicts
        $verdictCount = Verdict::count();
        if ($this->option('verdicts')) {
            $this->newLine();
            $this->info('Performing MAJOR update: generating all verdicts sitemaps...');

            // check if sitemap folder exists
            if (!file_exists($sitemapFolder . '/sitemaps/verdicts')) {
                mkdir($sitemapFolder . '/sitemaps/verdicts', 0777, true);
            }

            // verdicts
            $this->newLine();
            $this->info('Generating verdicts sitemap...');
            $processedCount = 0;
            Verdict::orderBy('id')
                ->chunk($chunkSize, function (Collection $verdicts) use ($sitemapFolder, &$sitemapFiles, &$processedCount, $verdictCount, $chunkSize) {
                    $processedCount++;
                    $this->info('Generating verdicts sitemap ' . $processedCount . ' of ' . ceil($verdictCount / $chunkSize) . '...');
                    Sitemap::create()
                        ->add($verdicts)
                        ->writeToFile($sitemapFolder . '/sitemaps/verdicts/verdicts_' . $processedCount . '.xml');
                    $sitemapFiles[] = ['file' => 'sitemaps/verdicts/verdicts_' . $processedCount . '.xml', 'type' => 'verdicts'];
                });
        } else {
            // add existed verdict sitemap files to main sitemap index
            $numVerdictSitemaps = ceil($verdictCount / $chunkSize);
            for ($i = 1; $i <= $numVerdictSitemaps; $i++) {
                $sitemapFiles[] = ['file' => 'sitemaps/verdicts/verdicts_' . $i . '.xml', 'type' => 'verdicts'];
            }
        }

        // search
        $this->newLine();
        $this->info('Generating search sitemap...');
        // get trending keywords
        $verdictService = new VerdictService();
        $trendingKeywords = $verdictService->getTrendingKeywords(50);
        $urls = [];
        foreach ($trendingKeywords as $keyword) {
            $urls[] = Url::create('/search?q=' . $keyword)->setLastModificationDate(now());
        }
        Sitemap::create()
            ->add($urls)
            ->writeToFile($sitemapFolder . '/sitemaps/search.xml');
        $sitemapFiles[] = ['file' => 'sitemaps/search.xml', 'type' => 'search'];

        // posts
        // check if sitemap folder exists
        if (!file_exists($sitemapFolder . '/sitemaps/posts')) {
            mkdir($sitemapFolder . '/sitemaps/posts', 0777, true);
        }
        $this->newLine();
        $this->info('Generating posts sitemap...');
        $postProcessedCount = 0;
        $postCount = Post::where('status', 'published')->count();
        Post::where('status', 'published')->orderBy('id')
            ->chunk($chunkSize, function (Collection $posts) use ($sitemapFolder, &$postProcessedCount, &$sitemapFiles, $postCount, $chunkSize) {
                $postProcessedCount++;
                $this->info('Generating posts sitemap ' . $postProcessedCount . ' of ' . ceil($postCount / $chunkSize) . '...');
                Sitemap::create()
                    ->add($posts)
                    ->writeToFile($sitemapFolder . '/sitemaps/posts/posts_' . $postProcessedCount . '.xml');
                $sitemapFiles[] = ['file' => 'sitemaps/posts/posts_' . $postProcessedCount . '.xml', 'type' => 'posts'];
            });


        // entities
        // people
        // check if sitemap folder exists
        if (!file_exists($sitemapFolder . '/sitemaps/people')) {
            mkdir($sitemapFolder . '/sitemaps/people', 0777, true);
        }
        $this->newLine();
        $this->info('Generating people sitemap...');
        $peopleProcessedCount = 0;
        $peopleCount = Person::count();
        Person::orderBy('id')
            ->chunk($chunkSize, function (Collection $people) use ($sitemapFolder, &$peopleProcessedCount, &$sitemapFiles, $peopleCount, $chunkSize) {
                $peopleProcessedCount++;
                $this->info('Generating people sitemap ' . $peopleProcessedCount . ' of ' . ceil($peopleCount / $chunkSize) . '...');
                Sitemap::create()
                    ->add($people)
                    ->writeToFile($sitemapFolder . '/sitemaps/people/people_' . $peopleProcessedCount . '.xml');
                $sitemapFiles[] = ['file' => 'sitemaps/people/people_' . $peopleProcessedCount . '.xml', 'type' => 'people'];
            });

        // organizations
        // check if sitemap folder exists
        if (!file_exists($sitemapFolder . '/sitemaps/organizations')) {
            mkdir($sitemapFolder . '/sitemaps/organizations', 0777, true);
        }
        $this->newLine();
        $this->info('Generating organizations sitemap...');
        $orgProcessedCount = 0;
        $orgCount = Organization::count();
        Organization::orderBy('id')
            ->chunk($chunkSize, function (Collection $organizations) use ($sitemapFolder, &$orgProcessedCount, &$sitemapFiles, $orgCount, $chunkSize) {
                $orgProcessedCount++;
                $this->info('Generating organizations sitemap ' . $orgProcessedCount . ' of ' . ceil($orgCount / $chunkSize) . '...');
                Sitemap::create()
                    ->add($organizations)
                    ->writeToFile($sitemapFolder . '/sitemaps/organizations/organizations_' . $orgProcessedCount . '.xml');
                $sitemapFiles[] = ['file' => 'sitemaps/organizations/organizations_' . $orgProcessedCount . '.xml', 'type' => 'organizations'];
            });

        // sitemap index
        $this->newLine();
        $this->info('Generating sitemap index...');
        $sitemapIndexGenerator = SitemapIndex::create();
        foreach ($sitemapFiles as $file) {
            $sitemapIndexGenerator->add(SitemapTag::create($file['file'])->setLastModificationDate(now()));
        }
        $sitemapIndexGenerator->writeToFile($sitemapFolder . '/sitemap_index.xml');

        $this->newLine();
        $this->info('Sitemap generated successfully.');
        return 0;
    }
}
