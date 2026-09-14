import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import type { RouteName } from 'ziggy-js';
import type { Locale } from './locales';

type RouteParams = Record<string, unknown> | string | number | unknown[] | undefined;

// return the route with the locale prefix
export function localeRoute(name: RouteName, params?: RouteParams, locale: Locale = 'zh-TW', absolute?: boolean) {
    return route(locale === 'en' ? (`en.${name}` as RouteName) : name, params as never, absolute);
}

export function useLocalizedRoute() {
    // get the locale from the page props(passed by SetLocale middleware, Inertia.js shared data)
    const { locale } = usePage<SharedData>().props;

    return (name: RouteName, params?: RouteParams, absolute?: boolean) => localeRoute(name, params, locale, absolute);
}

// return the path with the locale prefix
export function localizedPath(path: string, locale: Locale) {
    const [pathname, suffix = ''] = path.split(/(?=[?#])/u, 2);
    const withoutEnglishPrefix = pathname === '/en' ? '/' : pathname.replace(/^\/en(?=\/)/u, '');
    const localizedPathname = locale === 'en' ? (withoutEnglishPrefix === '/' ? '/en' : `/en${withoutEnglishPrefix}`) : withoutEnglishPrefix;

    return `${localizedPathname}${suffix}`;
}
