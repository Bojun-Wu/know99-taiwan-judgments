<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $isEnglishUrl = $request->segment(1) === 'en';

        // only redirect public routes
        $publicRoutes = [
            'home',
            'verdicts.search',
            'verdicts.trending',
            'verdicts.index',
            'verdicts.show',
            'posts.index',
            'posts.show',
            'entities.index',
            'people.show',
            'organizations.show',
            'about',
        ];

        // not english url and cookie locale is english and route is public route, redirect to english route
        if (! $isEnglishUrl && $request->cookie('locale') === 'en' && in_array($request->route()?->getName(), $publicRoutes, true)) {
            $target = route('en.' . $request->route()->getName(), $request->route()->parameters());

            if ($request->getQueryString()) {
                $target .= '?' . $request->getQueryString();
            }

            return redirect()->to($target);
        }

        $locale = $isEnglishUrl ? 'en' : 'zh_TW';

        app()->setLocale($locale);

        return $next($request)->withCookie(cookie(
            'locale',
            $locale === 'en' ? 'en' : 'zh-TW',
            60 * 24 * 365,
            '/',
            null,
            $request->isSecure(),
            false,
            false,
            'lax',
        ));
    }
}
