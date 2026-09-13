<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GooglebotDetectionService
{
    /**
     * Check if the current request is from Googlebot
     * 
     * @param Request $request
     * @return bool
     */
    public function isGooglebot(Request $request): bool
    {
        $userAgent = $request->header('User-Agent');
        
        if (empty($userAgent)) {
            return false;
        }

        // Googlebot User-Agent patterns
        $googlebotPatterns = [
            '/Googlebot/i',
            // '/Googlebot-Image/i',
            // '/Googlebot-News/i',
            // '/Googlebot-Video/i',
            // '/APIs-Google/i',
            // '/AdsBot-Google/i',
            // '/Mediapartners-Google/i',
            // '/Chrome-Lighthouse/i',
            // '/GTmetrix/i',
            // '/PageSpeed Insights/i',
        ];

        foreach ($googlebotPatterns as $pattern) {
            if (preg_match($pattern, $userAgent)) {
                Log::info('Googlebot detected', [
                    'pattern' => $pattern,
                    'user_agent' => $userAgent,
                    'ip' => $request->ip(),
                ]);
                return true;
            }
        }

        return false;
    }

    /**
     * Get the Googlebot type from User-Agent
     * 
     * @param Request $request
     * @return string|null
     */
    public function getGooglebotType(Request $request): ?string
    {
        $userAgent = $request->header('User-Agent');
        
        if (empty($userAgent)) {
            return null;
        }

        if (preg_match('/Googlebot-Image/i', $userAgent)) {
            return 'Googlebot-Image';
        }
        
        if (preg_match('/Googlebot-News/i', $userAgent)) {
            return 'Googlebot-News';
        }
        
        if (preg_match('/Googlebot-Video/i', $userAgent)) {
            return 'Googlebot-Video';
        }
        
        if (preg_match('/APIs-Google/i', $userAgent)) {
            return 'APIs-Google';
        }
        
        if (preg_match('/AdsBot-Google/i', $userAgent)) {
            return 'AdsBot-Google';
        }
        
        if (preg_match('/Mediapartners-Google/i', $userAgent)) {
            return 'Mediapartners-Google';
        }
        
        if (preg_match('/Chrome-Lighthouse/i', $userAgent)) {
            return 'Chrome-Lighthouse';
        }
        
        if (preg_match('/GTmetrix/i', $userAgent)) {
            return 'GTmetrix';
        }
        
        if (preg_match('/PageSpeed Insights/i', $userAgent)) {
            return 'PageSpeed Insights';
        }
        
        if (preg_match('/Googlebot/i', $userAgent)) {
            return 'Googlebot';
        }

        return null;
    }
} 