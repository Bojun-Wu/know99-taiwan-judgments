<?php

namespace App\Jobs;

use App\Models\PostView;
use App\Models\VerdictView;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class LogPostView implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $postId;
    protected string $ipAddress;
    protected string $sessionId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $postId, string $ipAddress, string $sessionId)
    {
        $this->postId = $postId;
        $this->ipAddress = $ipAddress;
        $this->sessionId = $sessionId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Check if a view was already logged for this session in the last 24 hours
        $existingView = PostView::where('post_id', $this->postId)
            ->where('created_at', '>=', now()->subDay())
            ->where(function ($query) {
                $query->where('session_id', $this->sessionId)
                    ->orWhere('ip_address', $this->ipAddress);
            })
            ->first();

        if (!$existingView) {
            PostView::create([
                'post_id' => $this->postId,
                'ip_address' => $this->ipAddress,
                'session_id' => $this->sessionId,
            ]);
        }
    }
}
