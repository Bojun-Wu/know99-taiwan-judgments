<?php

namespace App\Jobs;

use App\Models\VerdictView;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class LogVerdictView implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $verdictId;
    protected string $ipAddress;
    protected string $sessionId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $verdictId, string $ipAddress, string $sessionId)
    {
        $this->verdictId = $verdictId;
        $this->ipAddress = $ipAddress;
        $this->sessionId = $sessionId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Check if a view was already logged for this session in the last 24 hours
        $existingView = VerdictView::where('verdict_id', $this->verdictId)
            ->where('created_at', '>=', now()->subDay())
            ->where(function ($query) {
                $query->where('session_id', $this->sessionId)
                    ->orWhere('ip_address', $this->ipAddress);
            })
            ->first();

        if (!$existingView) {
            VerdictView::create([
                'verdict_id' => $this->verdictId,
                'ip_address' => $this->ipAddress,
                'session_id' => $this->sessionId,
            ]);
        }
    }
}
