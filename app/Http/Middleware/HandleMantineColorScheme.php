<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class HandleMantineColorScheme
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 讀取在cookie中的colorScheme，方便在server端就套用在app.blade.php中，避免colorScheme在client端執行時，造成閃爍
        $colorScheme = $request->cookie('mantine-color-scheme', 'light');

        if (!in_array($colorScheme, ['light', 'dark'])) {
            $colorScheme = 'light';
        }

        Inertia::share('colorScheme', $colorScheme);

        return $next($request);
    }
}
