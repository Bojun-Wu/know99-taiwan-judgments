<?php

namespace App\Jobs;

use App\Models\KeywordLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class LogSearchKeyword implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected string $keyword;
    protected string $ipAddress;
    protected string $sessionId;

    /**
     * Create a new job instance.
     */
    public function __construct(string $keyword, string $ipAddress, string $sessionId)
    {
        $this->keyword = $keyword;
        $this->ipAddress = $ipAddress;
        $this->sessionId = $sessionId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Check if a search was already logged for this session in the last 24 hours
        $existingLog = KeywordLog::where('keyword', $this->keyword)
            ->where('created_at', '>=', now()->subDay())
            ->where(function ($query) {
                $query->where('session_id', $this->sessionId)
                    ->orWhere('ip_address', $this->ipAddress);
            })
            ->first();

        if (!$existingLog) {
            KeywordLog::create([
                'keyword' => $this->keyword,
                'ip_address' => $this->ipAddress,
                'session_id' => $this->sessionId,
            ]);
        }
    }
}
