import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { type RouteName, route } from 'ziggy-js';
import { createI18n } from './i18n';
import type { Locale } from './i18n/locales';
import { theme } from './theme';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} | Know99`,
        resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
        setup: ({ App, props }) => {
            const locale = (page.props.locale || 'zh-TW') as Locale;
            const i18n = createI18n(locale);
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return (
                <I18nextProvider i18n={i18n}>
                    <MantineProvider theme={theme} defaultColorScheme="auto">
                        <Notifications />
                        <App {...props} />
                    </MantineProvider>
                </I18nextProvider>
            );
        },
    }),
);
